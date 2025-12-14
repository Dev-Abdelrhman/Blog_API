// import { Strategy } from 'passport-local';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { AuthService } from '../auth.service';
// import { Prisma } from '@prisma/client';

// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//   constructor(private readonly authService: AuthService) {
//     super({ usernameField: 'email' });
//   }

//   async validate(data: Prisma.UserLoginInput) {
//     const user = await this.authService.validateUser(data);
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     return user;
//   }
// }
