import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
@UseGuards(AuthGuard('jwt'))
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Get('mine')
  async mine(@Req() req: any) {
    return this.bookings.listMine(req.user.userId);
  }

  @Get('check')
  async check(@Query('start') start: string, @Query('end') end: string) {
    return this.bookings.check(start, end);
  }

  @Post()
  async create(@Req() req: any, @Body() dto: CreateBookingDto) {
    return this.bookings.create(req.user.userId, dto);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    return this.bookings.remove(req.user.userId, id);
  }
}
