import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service.js';
import { BlackListService } from './blacklist.service.js';
import { loginDto } from './dto/auth.dto.js';
import { CreateUserDto } from '../users/dtos/CreateUser.dto.js';
// import { LocalAuthGuard } from './utils/local-auth-guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly blacList: BlackListService,
  ) {}
  // @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Response() res, @Body() loginDto: loginDto) {
    const result = await this.authService.login(loginDto);

    res.cookie('access_token', result?.access_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 7,
    });
    res.cookie('refresh_token', result?.refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.json(result);
  }
  @Post('signup')
  @UsePipes(ValidationPipe)
  async signup(
    @Request() req,
    @Response() res,
    @Body() CreateUserDto: CreateUserDto,
  ) {
    const result = await this.authService.signup(CreateUserDto);

    res.cookie('access_token', result?.access_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 7,
    });
    res.cookie('refresh_token', result?.refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.json(result);
  }

  @Post('logout')
  async logout(@Request() req, @Response() res) {
    const token = req.cookies?.refresh_token;
    if (!token) {
      throw new UnauthorizedException('forbidden action');
    }
    await this.blacList.pushBlacklistedToken(token);

    res.clearCookie('access_token', { httpOnly: true, sameSite: 'strict' });
    res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'strict' });

    return res.status(200).json({ message: 'Logged out successfully' });
  }
}
