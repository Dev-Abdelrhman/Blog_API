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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { UpdateUserSettingsDto } from './dtos/UpdateUserSettings.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.getUserById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.getUserById(id);
    if (!user) throw new NotFoundException('User not found');
    const result = await this.usersService.deleteUser(id);
    return result;
  }

  @Patch(':userId/settings')
  @UsePipes(ValidationPipe)
  async updateUserSettings(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateSettingsDto: UpdateUserSettingsDto,
  ) {
    // const user = await this.usersService.getUserById(userId);
    // if (!user) throw new NotFoundException('User not found');
    return await this.usersService.UpdateUserSettings(
      userId,
      updateSettingsDto,
    );
  }
}
