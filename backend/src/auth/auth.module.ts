import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';   // <-- import UsersModule
import { AuthController } from './auth.controller';
import { Auth0JwtStrategy } from './auth0.strategy';
import { GoogleCalendarStrategy } from './google.calendar.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ session: false }),
    UsersModule, // <-- gives strategies access to UsersService
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get('JWT_STATE_SECRET') || cfg.get('JWT_SECRET'),
        signOptions: { expiresIn: '10m' }, // for OAuth state
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [Auth0JwtStrategy, GoogleCalendarStrategy],
})
export class AuthModule {}
