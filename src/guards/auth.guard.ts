import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { readFileSync } from 'fs';
import { verify } from 'jsonwebtoken';
import { Exceptions } from 'src/constants/exceptions';
import { guardlessMethods } from 'src/constants/guardless-methods';
import { GraphQlException } from 'src/utils/graphql-exception';
import { EntityManager } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly entityManager: EntityManager) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const method = ctx.getHandler().name;
    if (guardlessMethods.includes(method)) return true;
    const token = req.session['token'];
    if (!token) throw new GraphQlException('Login First...', 403, Exceptions.UNAUTHORIZED);
    const privateKey = readFileSync('src/keys/private.key');
    try {
      const { userId: id } = verify(token, privateKey, { algorithm: 'RS256' });
      const user = await this.entityManager.getRepository('users').findOne({ where: { id } });
      if (!id || !user) throw new GraphQlException('Login First...', 403, Exceptions.UNAUTHORIZED);
      req['user'] = user;
      return true;
    } catch (error) {
      throw new GraphQlException('Login First...', 403, Exceptions.UNAUTHORIZED);
    }
  }
}
