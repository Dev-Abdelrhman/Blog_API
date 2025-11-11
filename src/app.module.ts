import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { JwtMiddleware } from './auth/middleware/jwt.middleware';
import { RoleMiddleware } from './auth/middleware/role.middleware';
import { CommantsController } from './comments/comments.controller';
import { CommantsModule } from './comments/comments.module';

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
    consumer.apply(JwtMiddleware).forRoutes('posts', 'posts/:postId');

    consumer.apply(RoleMiddleware).forRoutes({
      path: 'posts/user/:authorId',
      method: RequestMethod.POST,
    });
  }
}
