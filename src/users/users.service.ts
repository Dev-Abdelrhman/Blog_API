import {
  NotFoundException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SerializedUser } from './types/serialize-user.type';
import { plainToClass } from 'class-transformer';
import { hashPassword } from 'src/utils/argon2';
import { subDays } from 'date-fns';

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
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
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
    if (data.password) {
      throw new BadRequestException(
        'Password cannot be updated from this endpoint',
      );
    }
    if (data.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: data.email as string },
      });

      if (emailExists) {
        if (emailExists.id === id) {
          delete data.email;
        } else {
          throw new BadRequestException('Email already in use');
        }
      }
    }
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });
    return new SerializedUser(updatedUser);
  }
  async disActive(id: number) {
    const findUser = await this.getUserById(id);
    if (!findUser) throw new NotFoundException('User not found');

    await this.prisma.userSettings.updateMany({
      where: { userId: id },
      data: { isActive: false },
    });
    await this.prisma.comment.deleteMany({
      where: { userId: id },
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
    return { success: true, message: 'User disactiveted successfully' };
  }
  async deleteUser(id: number) {
    const findUser = await this.getUserById(id);
    if (!findUser) throw new NotFoundException('User not found');

    await this.prisma.userSettings.delete({
      where: { userId: id },
    });
    await this.prisma.comment.deleteMany({
      where: { userId: id },
    });
    await this.prisma.post.deleteMany({
      where: { authorId: id },
    });
    await this.prisma.user.delete({
      where: { id },
    });
    return { success: true, message: 'User deleted successfully' };
  }
  async deleteInactiveUsers(days = 30) {
    const cutoffDate = subDays(new Date(), days);

    const inactiveUsers = await this.prisma.user.findMany({
      where: {
        isActive: false,
        updatedAt: { lte: cutoffDate },
      },
      select: { id: true },
    });

    if (!inactiveUsers.length) return 0;

    const inactiveUserIds = inactiveUsers.map((u) => u.id);

    await this.prisma.post.deleteMany({
      where: { authorId: { in: inactiveUserIds } },
    });

    await this.prisma.comment.deleteMany({
      where: { userId: { in: inactiveUserIds } },
    });

    const deleted = await this.prisma.user.deleteMany({
      where: { id: { in: inactiveUserIds } },
    });

    return deleted.count;
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
