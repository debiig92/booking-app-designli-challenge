import { Injectable } from '@nestjs/common';
import { google, Auth } from 'googleapis';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleService {
  private oauth: Auth.OAuth2Client;

  constructor(private users: UsersService, cfg: ConfigService) {
    this.oauth = new google.auth.OAuth2(
      cfg.get('GOOGLE_CLIENT_ID'),
      cfg.get('GOOGLE_CLIENT_SECRET'),
      cfg.get('GOOGLE_CALLBACK_URL'),
    );
  }

  private async getAuthorizedClient(userId: string) {
    const user = await this.users.findById(userId);
    if (!user?.googleAccessToken || !user.googleRefreshToken) {
      throw new Error('Google Calendar not connected. Please sign in with Google again.');
    }

    this.oauth.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken,
    });

    // Refresh if needed (googleapis handles expiry internally when making a call)
    this.oauth.on('tokens', async (tokens) => {
      if (tokens.access_token) {
        await this.users.updateTokens(
          userId,
          tokens.access_token,
          tokens.refresh_token ?? undefined,
          tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
        );
      }
    });

    return this.oauth;
  }

  /** Returns true if there is a calendar event overlapping [start, end) */
  async hasCalendarConflict(userId: string, startISO: string, endISO: string): Promise<boolean> {
    const auth = await this.getAuthorizedClient(userId);
    const calendar = google.calendar({ version: 'v3', auth });

    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startISO,
      timeMax: endISO,
      singleEvents: true,
      maxResults: 1,
    });

    const items = res.data.items ?? [];
    return items.length > 0;
  }
}
