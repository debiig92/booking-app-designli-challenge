import { BadRequestException, Injectable, ForbiddenException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { GoogleService } from '../google/google.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService, private google: GoogleService) {}

  /** Overlap rule: [start, end) overlaps existing if start < row.end && end > row.start */
  async hasSystemConflict(start: Date, end: Date): Promise<boolean> {
    const conflict = await this.prisma.booking.findFirst({
      where: {
        AND: [
          { start: { lt: end } },
          { end: { gt: start } },
        ],
      },
      select: { id: true },
    });
    return !!conflict;
  }

  async create(userId: string, dto: CreateBookingDto) {
    const start = new Date(dto.start);
    const end = new Date(dto.end);
    if (!(start < end)) {
      throw new BadRequestException('Start must be before end.');
    }

    // 1) Conflict with system bookings?
    if (await this.hasSystemConflict(start, end)) {
      throw new BadRequestException('Time slot conflicts with an existing booking in the system.');
    }

    // 2) Conflict with user Google Calendar?
    const calendarConflict = await this.google.hasCalendarConflict(
      userId, start.toISOString(), end.toISOString(),
    );
    if (calendarConflict) {
      throw new BadRequestException('Time slot conflicts with an event in your Google Calendar.');
    }

    return this.prisma.booking.create({
      data: {
        title: dto.title,
        start,
        end,
        ownerId: userId,
      },
    });
  }

  listMine(userId: string) {
    return this.prisma.booking.findMany({
      where: { ownerId: userId },
      orderBy: { start: 'asc' },
    });
  }

  async remove(userId: string, id: string) {
    const b = await this.prisma.booking.findUnique({ where: { id } });
    if (!b) throw new BadRequestException('Booking not found.');
    if (b.ownerId !== userId) throw new ForbiddenException('Not your booking.');
    await this.prisma.booking.delete({ where: { id } });
    return { ok: true };
  }

  async check(startISO: string, endISO: string) {
    const start = new Date(startISO);
    const end = new Date(endISO);
    if (!(start < end)) throw new BadRequestException('Invalid range.');
    const conflict = await this.hasSystemConflict(start, end);
    return { conflict };
  }
}
