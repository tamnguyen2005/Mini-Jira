import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { AuthGuard } from './guards/auth.guard';
import { UserDto } from './dto/users.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @HttpCode(200)
  async login(@Body() request: LoginDTO): Promise<{ accessToken: string }> {
    return this.authService.login(request);
  }

  @Post('register')
  async register(@Body() request: RegisterDTO): Promise<{ message: string }> {
    return this.authService.register(request);
  }

  @Get('users')
  @UseGuards(AuthGuard)
  async getUsers(): Promise<UserDto[]> {
    return this.authService.getUsers();
  }
}
