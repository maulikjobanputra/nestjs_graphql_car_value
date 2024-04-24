import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const Session = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => GqlExecutionContext.create(context).getContext().req.session
);
