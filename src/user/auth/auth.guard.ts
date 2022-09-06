import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '../user.entity';

/* Auth guard is a custom guard that is used to protect the endpoints.
   - It is used to verify requested user token and refresh the token.
*/
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements IAuthGuard {
  
  public handleRequest(err: unknown, user: User): any {
    return user;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const { user }: Request = context.switchToHttp().getRequest();

    return user ? true : false;
  }
}