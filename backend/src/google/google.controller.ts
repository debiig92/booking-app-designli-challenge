import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';

@Controller('google')
@UseGuards(AuthGuard('jwt'))
export class GoogleController {
  constructor(private users: UsersService) {}

  @Get('status')
  async status(@Req() req: any) {
    const user = await this.users.findById(req.user.userId);
    const connected = !!(user?.googleRefreshToken && user.googleRefreshToken.length > 0);
    return { connected };
  }
}
