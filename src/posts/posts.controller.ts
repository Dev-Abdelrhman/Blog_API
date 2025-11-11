import {
  Body,
  Param,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  NotFoundException,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/CreatePost.dto';
import { UpdatePostDto } from './dtos/UpdatePost.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Get()
  async getAllPosts() {
    return await this.postsService.getAllPosts();
  }
  @Post('user/:authorId')
  @UsePipes(ValidationPipe)
  async createPost(
    // @Param('authorId', ParseIntPipe) authorId: number,
    @Request() req,
    @Body() CreatePostDto: CreatePostDto,
  ) {
    const authorId = req.user.sub;
    console.log(authorId);

    return await this.postsService.createPost(authorId, CreatePostDto);
  }

  @Get('user')
  async getAllPostsByAuthorId(
    @Request() req,
    // @Param('authorId', ParseIntPipe) authorId: number,
  ) {
    const authorId = req.user.sub;
    return await this.postsService.getAllPostsByAuthorId(authorId);
  }

  @Get('user/:id')
  async getPostById(
    @Request() req,
    // @Param('authorId', ParseIntPipe) authorId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const authorId = req.user.sub;
    return await this.postsService.getPostById(authorId, id);
  }
  @Patch('user/:authorId/:id')
  @UsePipes(ValidationPipe)
  async updatePost(
    @Param('authorId', ParseIntPipe) authorId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdatePostDto: UpdatePostDto,
  ) {
    return await this.postsService.updatePost(authorId, id, UpdatePostDto);
  }
  @Delete('user/:authorId/:id')
  async deletePost(
    @Param('authorId', ParseIntPipe) authorId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.postsService.deletePost(authorId, id);
  }
}
