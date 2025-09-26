import { Module } from '@nestjs/common';
import { GoogleModule } from '../google/google.module';
import { PrismaModule } from '../prisma/prisma.module';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [PrismaModule, GoogleModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
