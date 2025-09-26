import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(cfg: ConfigService, private users: UsersService) {
    super({
      clientID: cfg.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: cfg.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL: cfg.get<string>('GOOGLE_CALLBACK_URL')!,
      scope: [
        'openid',
        'email',
        'profile',
        'https://www.googleapis.com/auth/calendar.readonly',
      ],
    });
  }

  public authorizationParams(_options: any): any {
    return { access_type: 'offline', prompt: 'consent' };
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Function,
  ) {
    const email = profile.emails?.[0]?.value!;
    const name = profile.displayName;
    const googleId = profile.id;

    const user = await this.users.upsertGoogleUser({
      googleId,
      email,
      name,
      accessToken,
      refreshToken: refreshToken || null,
      expiryDate: null,
    });

    done(null, { id: user.id, email: user.email, name: user.name });
  }
}
