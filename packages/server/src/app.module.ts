import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { PostsModule } from './posts/posts.module.js';
import { AuthModule } from './auth/auth.module.js';
import { JwtMiddleware } from './auth/middleware/jwt.middleware.js';
import { RoleMiddleware } from './auth/middleware/role.middleware.js';
import { CommantsController } from './comments/comments.controller.js';
import { CommantsModule } from './comments/comments.module.js';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UsersModule,
    PrismaModule,
    PostsModule,
    AuthModule,
    CommantsModule,
  ],
  controllers: [AppController, CommantsController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('posts');

    consumer.apply(RoleMiddleware).forRoutes({
      path: 'posts/user',
      method: RequestMethod.POST,
    });
  }
}
