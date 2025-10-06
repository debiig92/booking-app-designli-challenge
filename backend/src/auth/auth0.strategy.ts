import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class Auth0JwtStrategy extends PassportStrategy(Strategy, 'auth0-jwt') {
  constructor() {
    const domain = process.env.AUTH0_DOMAIN;
    const issuer = process.env.AUTH0_ISSUER_URL || `https://${domain}/`;
    const audience = process.env.AUTH0_AUDIENCE;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksUri: `https://${domain}/.well-known/jwks.json`,
      }) as any,
      algorithms: ['RS256'],
      issuer,
      audience,
    });
  }

  async validate(payload: any) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid Auth0 token');
    }
    return {
      sub: payload.sub,
      scope: payload.scope,
      permissions: payload.permissions,
      email: (payload as any)['https://schemas.auth0.com/email'] || (payload as any).email,
      name: (payload as any)['name'],
    };
  }
}
