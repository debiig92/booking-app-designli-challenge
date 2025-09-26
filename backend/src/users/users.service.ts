import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findByGoogleId(googleId: string) {
    return this.prisma.user.findUnique({ where: { googleId } });
  }
  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async upsertGoogleUser(input: {
    googleId: string;
    email: string;
    name?: string | null;
    accessToken?: string | null;
    refreshToken?: string | null;
    expiryDate?: Date | null;
  }): Promise<User> {
    const { googleId, email, name, accessToken, refreshToken, expiryDate } = input;
    return this.prisma.user.upsert({
      where: { googleId },
      update: {
        email,
        name: name ?? undefined,
        googleAccessToken: accessToken ?? undefined,
        googleRefreshToken: refreshToken ?? undefined,
        googleTokenExpiry: expiryDate ?? undefined,
      },
      create: {
        googleId,
        email,
        name: name ?? undefined,
        googleAccessToken: accessToken ?? undefined,
        googleRefreshToken: refreshToken ?? undefined,
        googleTokenExpiry: expiryDate ?? undefined,
      },
    });
  }

  async updateTokens(userId: string, access: string, refresh?: string, expiry?: Date) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        googleAccessToken: access,
        googleRefreshToken: refresh ?? undefined,
        googleTokenExpiry: expiry ?? undefined,
      },
    });
  }
}
