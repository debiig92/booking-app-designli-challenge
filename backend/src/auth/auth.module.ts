import { Module } from '@nestjs/common';
/*import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { GoogleProfileStrategy } from './google.profile.strategy';
import { GoogleCalendarStrategy } from './google.calendar.strategy'; */
import { Auth0JwtStrategy } from './auth0.strategy';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

/* Auth2 Implementation
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [GoogleStrategy, JwtStrategy],
})*/

@Module({
  providers: [
    Auth0JwtStrategy,
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) => {
        class GlobalJwtGuard extends JwtAuthGuard {
          canActivate(context) {
            const isPublic = reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
              context.getHandler(),
              context.getClass(),
            ]);
            if (isPublic) return true;
            return super.canActivate(context) as any;
          }
        }
        return new GlobalJwtGuard();
      },
      inject: [Reflector],
    },
  ],
})
export class AuthModule {}
