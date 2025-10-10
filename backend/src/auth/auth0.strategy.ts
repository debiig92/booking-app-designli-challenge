import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class Auth0JwtStrategy extends PassportStrategy(Strategy, 'auth0-jwt') {
  constructor(
    private readonly cfg: ConfigService,
    private readonly users: UsersService,
  ) {
    const domain = cfg.get<string>('AUTH0_DOMAIN');
    const issuer = cfg.get<string>('AUTH0_ISSUER_URL') || `https://${domain}/`;
    const audience = cfg.get<string>('AUTH0_AUDIENCE');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        jwksUri: `${issuer}.well-known/jwks.json`,
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
      }),
      audience,
      issuer,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    if (!payload?.sub) throw new UnauthorizedException('Invalid Auth0 token');

    const sub: string = payload.sub; // e.g. "google-oauth2|1098..."
    const email: string | undefined =
      (payload as any)['https://schemas.auth0.com/email'] || (payload as any).email;
    const name: string | undefined = (payload as any)['name'];

    // Idempotent: will link/create a local user and return the DB id
    const user = await this.users.findOrCreateFromAuth({
      auth0Sub: sub,
      email,
      name,
    });

    // IMPORTANT: userId MUST be the DB id
    return {
      userId: user?.id,
      sub,          // keep original Auth0 subject for reference if needed
      email: user?.email,
      name: user?.name,
    };
  }
}
