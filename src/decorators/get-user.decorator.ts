import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => GqlExecutionContext.create(context).getContext().req.user
);
// export const GetUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
//   const request = ctx.switchToHttp().getRequest();
//   return request.user;
// });
