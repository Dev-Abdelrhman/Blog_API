import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async createPost(
    authorId: number,
    data: Prisma.PostCreateWithoutAuthorInput,
  ) {
    const author = await this.usersService.getUserById(authorId);
    if (!author) throw new NotFoundException('Author not found');
    return await this.prisma.post.create({
      data: {
        ...data,
        authorId: authorId,
      },
    });
  }
  async getAllPosts() {
    return await this.prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getAllPostsByAuthorId(id: number) {
    const author = await this.usersService.getUserById(id);
    if (!author) throw new NotFoundException('Author not found');
    const posts = await this.prisma.post.findMany({
      where: { authorId: id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!posts || posts.length === 0)
      throw new NotFoundException('No posts found for this author');
    return posts;
  }

  async getPostById(authorId: number, id: number) {
    const author = await this.usersService.getUserById(authorId);
    if (!author) throw new NotFoundException('Author not found');
    const post = await this.prisma.post.findUnique({
      where: { id: id, authorId: authorId },
    });
    if (!post) throw new NotFoundException('Post not found for this author');
    return post;
  }

  async updatePost(authorId: number, id: number, data: Prisma.PostUpdateInput) {
    const author = await this.usersService.getUserById(authorId);
    if (!author) throw new NotFoundException('Author not found');
    const post = await this.prisma.post.findUnique({
      where: { id: id, authorId: authorId },
    });
    if (!post) throw new NotFoundException('Post not found for this author');
    return await this.prisma.post.update({
      where: { id: id },
      data,
    });
  }
  async deletePost(authorId: number, id: number) {
    const author = await this.usersService.getUserById(authorId);
    if (!author) throw new NotFoundException('Author not found');
    const post = await this.prisma.post.findUnique({
      where: { id: id, authorId: authorId },
    });
    if (!post) throw new NotFoundException('Post not found for this author');
    await this.prisma.comment.deleteMany({
      where: { postId: id },
    });
    await this.prisma.post.delete({
      where: { id: id },
    });
    return { success: true, message: 'Post deleted successfully' };
  }
}
