import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleCalendarAuthGuard extends AuthGuard('google-calendar') {
  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    // Ensure 'state' is forwarded to Google
    return { state: req.query?.state };
  }
}
