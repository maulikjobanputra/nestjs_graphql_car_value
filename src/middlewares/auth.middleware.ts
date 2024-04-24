import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { readFileSync } from 'fs';
import { EntityManager } from 'typeorm';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly entityManager: EntityManager) {}
  async use(req: Request, _res: Response, next: NextFunction) {
    const token = req.session['token'];
    if (!token) throw new UnauthorizedException();
    const privateKey = readFileSync('src/keys/private.key');
    try {
      const { userId: id } = verify(token, privateKey, { algorithm: 'RS256' });
      const user = await this.entityManager.getRepository('users').findOne({ where: { id } });
      if (!id || !user) throw new UnauthorizedException();
      req['user'] = user;
    } catch (error) {
      throw new UnauthorizedException();
    }
    next();
  }
}
