import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { BlackListService } from '../blacklist.service';
@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly blacklistService: BlackListService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies?.access_token;
    const refreshToken = req.cookies?.refresh_token;

    if (!accessToken && !refreshToken) {
      throw new UnauthorizedException('No authentication token found');
    }
    const InvalidToken =
      await this.blacklistService.isTokenBlacklisted(refreshToken);
    if (InvalidToken) {
      res.clearCookie('access_token', { httpOnly: true, sameSite: 'strict' });
      res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'strict' });
      throw new UnauthorizedException(
        'No authentication token found-GO TO HELL',
      );
    }

    try {
      const decoded = await this.jwtService.verifyAsync(accessToken, {
        secret: process.env.JWT_SECRET,
      });
      req['user'] = decoded;
      return next();
    } catch (error) {
      console.log('');

      if (error.name === 'TokenExpiredError' && refreshToken) {
        try {
          const decodedRefresh = await this.jwtService.verifyAsync(
            refreshToken,
            {
              secret: process.env.JWT_REFRESH_SECRET,
            },
          );

          const payload = {
            sub: decodedRefresh.sub,
          };

          const newAccessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRATION_TIME || ('7h' as any),
          });
          const newRefreshToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn:
              process.env.JWT_EXPIRATION_TIME_REFRESH_TOKEN || ('7d' as any),
          });

          res.cookie('access_token', newAccessToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 7,
          });

          res.cookie('refresh_token', newRefreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 * 7,
          });

          req['user'] = payload;
          return next();
        } catch (refreshError) {
          throw new UnauthorizedException('Invalid or expired refresh token');
        }
      }

      throw new UnauthorizedException('Invalid access token');
    }
  }
}
