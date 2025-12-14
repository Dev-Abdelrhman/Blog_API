import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from '../users.service';

@Injectable()
export class UserCleanupTask {
  constructor(private readonly usersService: UsersService) {}

  // Run every day at midnight
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    const deletedCount = await this.usersService.deleteInactiveUsers(30);
    console.log(
      `Deleted ${deletedCount} inactive users and their posts/comments`,
    );
  }
}
