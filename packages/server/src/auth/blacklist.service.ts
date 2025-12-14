import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BlackListService {
  constructor(private readonly prisma: PrismaService) {}

  async pushBlacklistedToken(token: string) {
    if (!token) return;

    try {
      await this.prisma.blackList.create({
        data: { token },
      });
    } catch (error) {
      if (error.code !== 'P2002') {
        throw error;
      }
    }
  }
  async isTokenBlacklisted(token: string) {
    const found = await this.prisma.blackList.findUnique({
      where: { token },
    });
    return !!found;
  }
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupBlacklistedTokens() {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - 7);

    await this.prisma.blackList.deleteMany({
      where: { createdAt: { lt: expirationDate } },
    });

    console.log('Expired blacklisted tokens removed');
  }
}
