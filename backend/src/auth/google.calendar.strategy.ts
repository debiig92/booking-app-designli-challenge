import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GoogleCalendarStrategy extends PassportStrategy(Strategy, 'google-calendar') {
constructor(
    cfg: ConfigService,
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {
    super({
      clientID: cfg.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: cfg.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL: cfg.get<string>('GOOGLE_CALENDAR_CALLBACK_URL')!,
      scope: ['openid','email','profile','https://www.googleapis.com/auth/calendar'],
      passReqToCallback: true,
    });
  }

    public authorizationParams(_options: any): any {
        return { access_type: 'offline', prompt: 'consent' };
    }


async validate(
    req: any,
    accessToken: string,
    refreshToken: string | undefined,
    params: any,
    profile: Profile,
  ) {
    const state = req.query?.state as string | undefined;
    if (!state) throw new UnauthorizedException('Missing state');

    let uid: string;
    try {
      const decoded = this.jwt.verify<{ uid: string }>(state);
      uid = decoded.uid; // <-- DB user id we signed earlier
    } catch {
      throw new UnauthorizedException('Invalid state');
    }

    const expiry =
      typeof params?.expires_in === 'number'
        ? new Date(Date.now() + params.expires_in * 1000)
        : undefined;

    // Persist tokens for *this* DB user id
    await this.users.updateTokens(uid, accessToken, refreshToken ?? undefined, expiry);

    return {
      userId: uid,
      email: profile.emails?.[0]?.value,
      provider: 'google',
    };
  }
    
}
