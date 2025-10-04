import { Controller, Get, Req, Res, UseGuards, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(private jwt: JwtService, private cfg: ConfigService) {}

  // ----- LOGIN (profile only) -----
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = (req as any).user as { id: string; email: string; name?: string };
    const token = this.jwt.sign({ sub: user.id, email: user.email, name: user.name });
    const frontend = this.cfg.get('FRONTEND_URL');
    return res.redirect(`${frontend}/auth/callback?token=${encodeURIComponent(token)}`);
  }

  // ----- CONNECT CALENDAR (requires existing JWT passed as `state`) -----
  @Get('google-calendar')
  @UseGuards(AuthGuard('google-calendar'))
  async connectCalendar(@Headers('authorization') _auth: string) {
    // Passport will redirect to Google. We do not parse headers here—frontend sends ?state=<jwt>.
  }

  @Get('google-calendar/callback')
  @UseGuards(AuthGuard('google-calendar'))
  async connectCalendarCallback(@Req() req: Request, @Res() res: Response) {
    const frontend = this.cfg.get('FRONTEND_URL');
    return res.redirect(`${frontend}/dashboard?calendar=connected`);
  }
}
