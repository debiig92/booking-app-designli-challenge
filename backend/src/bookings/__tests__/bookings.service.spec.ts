import { Test } from '@nestjs/testing';
import { BookingsService } from '../bookings.service';
import { GoogleService } from '../../google/google.service';
import { BadRequestException } from '@nestjs/common';

import { prismaMock } from '../__mocks__/prisma.service.mock';
import { googleMock } from '../__mocks__/google.service.mock';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../../users/users.service';

describe('BookingsService', () => {

  const mockUsersService = {
    findById: jest.fn().mockResolvedValue({
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      googleId: 'google-123',
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh',
      expiryDate: null,
    }),

    upsertGoogleUser: jest.fn().mockResolvedValue({
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      googleId: 'google-123',
    }),

    updateTokens: jest.fn().mockResolvedValue(true),
  };

  let service: BookingsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: GoogleService, useValue: googleMock },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get(BookingsService);
  });

  describe('hasSystemConflict', () => {
    it('returns true when overlapping booking exists', async () => {
      prismaMock.booking.findFirst.mockResolvedValueOnce({ id: 'x' });
      const start = new Date('2025-01-01T10:00:00Z');
      const end = new Date('2025-01-01T11:00:00Z');
      await expect(service.hasSystemConflict(start, end)).resolves.toBe(true);
    });

    it('returns false when no overlap', async () => {
      prismaMock.booking.findFirst.mockResolvedValueOnce(null);
      const start = new Date('2025-01-01T10:00:00Z');
      const end = new Date('2025-01-01T11:00:00Z');
      await expect(service.hasSystemConflict(start, end)).resolves.toBe(false);
    });
  });

  describe('create', () => {
    const userId = 'user_1';
    const dto = {
      title: 'Standup',
      start: '2025-01-01T10:00:00.000Z',
      end: '2025-01-01T10:30:00.000Z',
    };

    it('throws if start >= end', async () => {
      await expect(
        service.create(userId, { ...dto, start: dto.end, end: dto.start }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rejects when system conflict exists', async () => {
      prismaMock.booking.findFirst.mockResolvedValueOnce({ id: 'any' }); // conflict
      await expect(service.create(userId, dto as any)).rejects.toThrow(
        'Time slot conflicts with an existing booking in the system.',
      );
    });

    it('rejects when Google Calendar has conflict', async () => {
      prismaMock.booking.findFirst.mockResolvedValueOnce(null); // no system conflict
      googleMock.hasCalendarConflict.mockResolvedValueOnce(true);
      await expect(service.create(userId, dto as any)).rejects.toThrow(
        'Time slot conflicts with an event in your Google Calendar.',
      );
    });

    it('creates booking when no conflicts', async () => {
      prismaMock.booking.findFirst.mockResolvedValueOnce(null);
      googleMock.hasCalendarConflict.mockResolvedValueOnce(false);
      prismaMock.booking.create.mockResolvedValueOnce({ id: 'b1', ...dto, ownerId: userId });

      const out = await service.create(userId, dto as any);
      expect(out.id).toBe('b1');
      expect(prismaMock.booking.create).toHaveBeenCalled();
    });
  });
});
