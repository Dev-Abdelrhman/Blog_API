import { NotFoundException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SerializedUser } from './types/serialize-user.type';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async createUser(data: Prisma.UserCreateInput) {
    return await this.prisma.user.create({
      data: {
        ...data,
        settings: {
          create: {
            theme: 'light',
            notifications: true,
          },
        },
      },
    });
  }
  async getUsers() {
    const users = await this.prisma.user.findMany({
      include: {
        settings: {
          select: {
            theme: true,
            notifications: true,
          },
        },
      },
    });
    return users.map((user) => plainToClass(SerializedUser, user));
  }
  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        settings: {
          select: {
            theme: true,
            notifications: true,
          },
        },
        posts: {
          select: {
            title: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return new SerializedUser(user);
    // return user;
  }
  async updateUser(id: number, data: Prisma.UserUpdateInput) {
    const findUser = await this.getUserById(id);
    if (!findUser) throw new NotFoundException('User not found');
    if (data.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: data.email as string },
      });
      if (emailExists) throw new NotFoundException('Email already in use');
    }
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }
  async deleteUser(id: number) {
    const findUser = await this.getUserById(id);
    if (!findUser) throw new NotFoundException('User not found');
    await this.prisma.user.delete({
      where: { id },
    });
    return { success: true, message: 'User deleted successfully' };
  }

  async UpdateUserSettings(
    userId: number,
    data: Prisma.UserSettingsUpdateInput,
  ) {
    const findUser = await this.getUserById(userId);
    if (!findUser) throw new NotFoundException('User not found');
    if (!findUser.settings) {
      throw new NotFoundException('bad request: settings not found');
    }
    return await this.prisma.userSettings.update({
      where: { userId },
      data,
    });
  }
}
