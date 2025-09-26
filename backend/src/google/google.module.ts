import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { UsersModule } from '../users/users.module';
import { GoogleController } from './google.controller';

@Module({
  imports: [UsersModule],
  providers: [GoogleService],
  controllers: [GoogleController],
  exports: [GoogleService],
})
export class GoogleModule {}
