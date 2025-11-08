import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Response,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { loginDto } from './dto/auth.dto';
// import { LocalAuthGuard } from './utils/local-auth-guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
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
}
