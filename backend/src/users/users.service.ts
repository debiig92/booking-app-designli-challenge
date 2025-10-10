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

 async findOrCreateFromAuth(opts: { auth0Sub: string; email?: string; name?: string }) {
    const { auth0Sub, name } = opts;
    
    const email = opts.email?.trim().toLowerCase(); // normalize


  console.log(auth0Sub,email,name)

    // 1) If we have an email, do a single upsert on the unique email key.
    if (email) {
      return this.prisma.user.upsert({
        where: { email }, // requires `@@unique([email])` or `@unique` on email
        update: {
          // attach googleId if not set yet (it's fine to set it every time)
          googleId: auth0Sub,
          ...(name ? { name } : {}),
        },
        create: {
          email,
          name: name ?? null,
          googleId: auth0Sub, // your model requires this on create
        },
      });
    }

    // 2) No email available: reconcile by googleId (make it unique in schema).
    const byGoogleId = await this.prisma.user.findFirst({ where: { googleId: auth0Sub } });
    if (byGoogleId) {
      // Optionally update name if we learned it later
      if (name && byGoogleId.name !== name) {
        return this.prisma.user.update({
          where: { id: byGoogleId.id },
          data: { name },
        });
      }
      return byGoogleId;
    }
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
