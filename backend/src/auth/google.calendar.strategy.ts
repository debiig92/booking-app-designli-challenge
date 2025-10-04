import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GoogleCalendarStrategy extends PassportStrategy(Strategy, 'google-calendar') {
    constructor(cfg: ConfigService, private users: UsersService, private jwt: JwtService) {
        super({
            clientID: cfg.get<string>('GOOGLE_CLIENT_ID')!,
            clientSecret: cfg.get<string>('GOOGLE_CLIENT_SECRET')!,
            callbackURL: cfg.get<string>('GOOGLE_CALENDAR_CALLBACK_URL')!.replace('/auth/google/callback', '/auth/google-calendar/callback'),
            scope: ['https://www.googleapis.com/auth/calendar.readonly', 'openid', 'email', 'profile'],
            passReqToCallback: true,
        });
    }

    public authorizationParams(_options: any): any {
        return { access_type: 'offline', prompt: 'consent' };
    }


    async validate(req: any, accessToken: string, refreshToken: string, _profile: Profile, done: Function) {
        // We pass our app's JWT in the "state" query
        const stateToken = req.query?.state as string | undefined;
        console.debug("stateToken value: " , stateToken)
        if (!stateToken) throw new UnauthorizedException('Missing state token');

        const payload = this.jwt.verify(stateToken);
        const userId = payload?.sub as string | undefined;
        if (!userId) throw new UnauthorizedException('Invalid state token');

        // Persist tokens on the user
        await this.users.updateTokens(userId, accessToken, refreshToken || undefined);

        // This strategy is only for connecting calendar, not for logging in
        done(null, { userId });
    }
}
