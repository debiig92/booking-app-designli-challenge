import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class GoogleProfileStrategy extends PassportStrategy(Strategy, 'google-profile') {
  constructor(cfg: ConfigService, private users: UsersService) {
    super({
      clientID: cfg.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: cfg.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL: cfg.get<string>('GOOGLE_PROFILE_CALLBACK_URL')!,
      scope: ['openid', 'email', 'profile'],
      
    });
  }

  public authorizationParams(_options: any): any {
        return { access_type: 'offline', prompt: 'consent' };
  }

  async validate(accessToken: string, _refreshToken: string, profile: Profile, done: Function) {
    const email = profile.emails?.[0]?.value!;
    const name = profile.displayName;
    const googleId = profile.id;

    const user = await this.users.upsertGoogleUser({
      googleId,
      email,
      name,
      accessToken: null,
      refreshToken: null,
      expiryDate: null,
    });

    done(null, { id: user.id, email: user.email, name: user.name });
  }
}
