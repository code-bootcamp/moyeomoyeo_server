// 유저 인터페이스 추가?

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface ICurrentUser {
  id?: string;
  email: string;
  name?: string;
  password?: string;
}

export const TargetUser = createParamDecorator(
  (_, context: ExecutionContext): ICurrentUser => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
