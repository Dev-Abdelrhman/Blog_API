import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller.js';
import { PostsService } from './posts.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { UsersModule } from '../users/users.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule],
  controllers: [PostsController],
  providers: [PostsService, JwtService],
  exports: [PostsService],
})
export class PostsModule {}
