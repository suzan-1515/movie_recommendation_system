import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../user.entity';
import { AuthHelper } from './auth.helper';

// Jwt strategy is used to verify the token and return the user.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  constructor(@Inject(ConfigService) config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_KEY'),
      ignoreExpiration: true,
    });
  }

  private validate(payload: string): Promise<User | never>{
    return this.helper.validateUser(payload);
  }
}