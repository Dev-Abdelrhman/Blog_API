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
  Inject,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { UpdateUserSettingsDto } from './dtos/UpdateUserSettings.dto';
import { SerializedUser } from './types/serialize-user.type';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    const users = this.usersService.getUsers();
    return users;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.getUserById(id);
    return user;
    // return new SerializedUser(user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  @UsePipes(ValidationPipe)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async disActive(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.disActive(id);
  }
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.deleteUser(id);
  }

  @Patch(':userId/settings')
  @UsePipes(ValidationPipe)
  async updateUserSettings(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateSettingsDto: UpdateUserSettingsDto,
  ) {
    return await this.usersService.UpdateUserSettings(
      userId,
      updateSettingsDto,
    );
  }
}
