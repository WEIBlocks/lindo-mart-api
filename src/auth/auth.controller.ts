import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CustomRequest } from '../types/custom-request.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: any) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }

  // @Post('forgot-password')
  // async forgotPassword(@Body('email') email: string) {
  //   return this.authService.forgotPassword(email);
  // }

  @Post('reset-password')
  @UseGuards(JwtAuthGuard)
  async resetPassword(
    @Request() req: CustomRequest,
    @Body() resetPasswordDto: any
  ) {
    return this.authService.resetPassword(req.user.userId, resetPasswordDto);
  }
}
