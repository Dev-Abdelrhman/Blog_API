import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../../users/users.service.js';

@Injectable()
export class RoleMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies?.access_token;
    if (!accessToken) {
      throw new UnauthorizedException('Invalid access token');
    }
    const decoded = await this.jwtService.verifyAsync(accessToken, {
      secret: process.env.JWT_SECRET,
    });
    if (!decoded) {
      throw new UnauthorizedException('Invalid access token');
    }
    const user = await this.usersService.getUserById(decoded.sub);
    if (user.role !== 'author') {
      throw new ForbiddenException(
        "You don't have the right access to this action",
      );
    }
    next();
  }
}
