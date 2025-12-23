import { Module } from '@nestjs/common';
import { CommantsService } from './comments.service.js';
import { CommantsController } from './comments.controller.js';
import { UsersModule } from '../users/users.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PostsModule } from '../posts/posts.module.js';

@Module({
  imports: [UsersModule, PrismaModule, PostsModule],
  providers: [CommantsService],
  controllers: [CommantsController],
  exports: [CommantsService],
})
export class CommantsModule {}
