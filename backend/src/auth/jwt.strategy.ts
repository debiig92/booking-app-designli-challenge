import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(cfg: ConfigService, private users: UsersService) {
    const secret = cfg.get<string>('JWT_SECRET');
    if (!secret) {
      // Hard fail early with a descriptive message so types are satisfied and runtime is safe
      throw new Error('JWT_SECRET is missing. Set it in backend/.env');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,           // <- guaranteed string here
      ignoreExpiration: false,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    // Return shape becomes req.user
    const user = await this.users.findById(payload.sub);
    return user ? { userId: user.id, email: user.email } : null;
  }
}
