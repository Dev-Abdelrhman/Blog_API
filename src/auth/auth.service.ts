import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { comparePasswords } from '../utils/argon2';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async generateToken(payload: { sub: number }) {
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRATION_TIME || ('7h' as any),
    });
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_EXPIRATION_TIME_REFRESH_TOKEN || ('7d' as any),
    });
    return { access_token, refresh_token };
  }
  async login(data: Prisma.UserCreateInput) {
    const user = await this.usersService.findUserByEmail(data.email);
    if (user?.isActive === false) {
      await this.usersService.reActive(user.id);
    }
    if (user) {
      const passwordValid = await comparePasswords(
        data.password,
        user.password,
      );
      if (!passwordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const { access_token, refresh_token } = await this.generateToken({
        sub: user.id,
      });
      return {
        massage: 'login successful',
        access_token: access_token,
        refresh_token: refresh_token,
        user: {
          id: user.id,
          email: user.email,
        },
      };
    }
  }
  async logout() {}
}
