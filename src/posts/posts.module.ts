import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { JwtMiddleware } from '../auth/middleware/jwt.middleware';
import { RoleMiddleware } from '../auth/middleware/role.middleware';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule],
  controllers: [PostsController],
  providers: [PostsService, JwtService],
})
export class PostsModule {}
