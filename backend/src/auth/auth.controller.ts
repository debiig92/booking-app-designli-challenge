import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GoogleCalendarAuthGuard } from './google-calendar.guard';
import { JwtService } from '@nestjs/jwt';
import { Public } from './public.decorator';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwt: JwtService,
    private readonly users: UsersService,         // <-- ensure UsersModule exports UsersService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('google-calendar')
  async connectGoogleCalendar(@Req() req: any, @Res() res: Response) {
    // From Auth0JwtStrategy.validate()
    const auth0Sub: string = req.user?.userId;    // e.g., "google-oauth2|123..."
    const email: string | undefined = req.user?.email;
    const name: string | undefined = req.user?.name;

    // Make sure a local user row exists (create if missing) and get its DB id
    const user = await this.users.findOrCreateFromAuth({ auth0Sub, email, name });

    // Sign DB uid into state (short exp set via JwtModule)
    const state = await this.jwt.signAsync({ uid: user?.id });

    const search = new URLSearchParams({ state }).toString();
    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
    // Send browser to the frontend proxy so redirects flow through it
    return res.redirect(`${frontend}/api/backend/auth/google-calendar/consent?${search}`);
  }

  @Public()
  @UseGuards(GoogleCalendarAuthGuard)
  @Get('google-calendar/consent')
  async googleCalendarConsent() { return; }

  @Public()
  @UseGuards(GoogleCalendarAuthGuard)
  @Get('google-calendar/callback')
  async googleCalendarCallback(@Res() res: Response) {
    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(`${frontend}/dashboard?calendar=connected`);
  }
}
