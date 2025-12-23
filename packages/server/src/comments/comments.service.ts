import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '../../prisma/generated/prisma/client.js';
import { PostsService } from '../posts/posts.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UsersService } from '../users/users.service.js';
import { CreateCommentDto } from './dto/CreateComment.dto.js';

@Injectable()
export class CommantsService {
  constructor(
    private readonly userService: UsersService,
    private readonly prisma: PrismaService,
    private readonly postService: PostsService,
  ) {}
  async createComment(data: CreateCommentDto, userId, postId) {
    const { parentId, ...commentData } = data;
    const user = await this.userService.getUserById(userId);
    const post = await this.postService.getPostById(userId, postId);
    if (parentId) {
      const parentComment = await this.prisma.comment.findUnique({
        where: { id: parentId },
      });
      if (!parentComment) {
        throw new NotFoundException('Parent comment does not exist');
      }
    }
    return this.prisma.comment.create({
      data: {
        ...commentData,
        user: { connect: { id: userId } },
        post: { connect: { id: postId } },
        parent: parentId ? { connect: { id: parentId } } : undefined,
      },
    });
  }
  async getComments(userId, postId) {
    const post = await this.postService.getPostById(userId, postId);
    if (!post) {
      throw new NotFoundException('This post is not exist or deleted');
    }
    return await this.prisma.comment.findMany({
      where: { postId: postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }
  async updateComment(data: Prisma.CommentUpdateInput, id, userId, postId) {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException('Forbbiden');
    }
    const post = await this.postService.getPostById(userId, postId);
    if (!post) {
      throw new NotFoundException('This post is not exist or deleted');
    }
    return await this.prisma.comment.update({
      where: { id: id, userId: userId, postId: postId },
      data,
    });
  }
  async deleteComment(id, userId, postId) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: id, userId: userId, postId: postId },
    });
    if (!comment) {
      throw new NotFoundException('Not found');
    }
    return await this.prisma.comment.delete({
      where: { id: id, userId: userId, postId: postId },
    });
  }
}
