import { NotFoundException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

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
    return await this.prisma.user.findMany({
      include: {
        settings: {
          select: {
            theme: true,
            notifications: true,
          },
        },
      },
    });
  }
  async getUserById(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        settings: {
          select: {
            theme: true,
            notifications: true,
          },
        },
      },
    });
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
