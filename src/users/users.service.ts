import { NotFoundException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SerializedUser } from './types/serialize-user.type';
import { plainToClass } from 'class-transformer';
import { hashPassword } from 'src/utils/argon2';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async createUser(data: Prisma.UserCreateInput) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new NotFoundException('Email already in use');
    }
    const password = await hashPassword(data.password);
    return await this.prisma.user.create({
      data: {
        ...data,
        password,
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
      where: {
        isActive: true,
      },
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
      where: { id: id, isActive: true },
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

    await this.prisma.userSettings.updateMany({
      where: { userId: id },
      data: { isActive: false },
    });
    await this.prisma.post.updateMany({
      where: { authorId: id },
      data: {
        published: false,
      },
    });
    await this.prisma.user.update({
      where: { id },
      data: {
        isActive: false,
      },
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

  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }
  async reActive(id: number) {
    await this.prisma.user.update({
      where: { id },
      data: {
        isActive: true,
      },
    });
    await this.prisma.userSettings.updateMany({
      where: { userId: id },
      data: { isActive: true },
    });

    await this.prisma.post.updateMany({
      where: { authorId: id },
      data: {
        published: true,
      },
    });
  }
}
