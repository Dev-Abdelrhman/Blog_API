import { Module } from '@nestjs/common';
import { CommantsService } from './comments.service';
import { CommantsController } from './comments.controller';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [UsersModule, PrismaModule, PostsModule],
  providers: [CommantsService],
  controllers: [CommantsController],
})
export class CommantsModule {}
