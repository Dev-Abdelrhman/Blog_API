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
  Request,
} from '@nestjs/common';
import { CommantsService } from './comments.service';
import { CreateCommentDto } from './dto/CreateComment.dto';
import { UpdateCommentDto } from './dto/UpdateComment.dto';

@Controller('posts/:postId/comments')
export class CommantsController {
  constructor(private readonly commentService: CommantsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createComment(
    @Request() req,
    @Param('postId', ParseIntPipe) postId: number,
    @Body()
    CreateCommentDto: CreateCommentDto,
  ) {
    const userId = req.user.sub;
    return await this.commentService.createComment(
      CreateCommentDto,
      userId,
      postId,
    );
  }

  @Get()
  @UsePipes(ValidationPipe)
  async getcomments(
    @Request() req,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    const userId = req.user.sub;
    console.log(userId);

    return await this.commentService.getComments(userId, postId);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  async updateComment(
    @Request() req,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateCommentDto: UpdateCommentDto,
  ) {
    const userId = req.user.sub;
    return await this.commentService.updateComment(
      UpdateCommentDto,
      id,
      userId,
      postId,
    );
  }

  @Delete('id')
  @UsePipes(ValidationPipe)
  async deleteComment(
    @Request() req,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user.sub;
    return await this.commentService.deleteComment(id, userId, postId);
  }
}
