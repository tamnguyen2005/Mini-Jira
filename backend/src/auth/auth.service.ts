import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/users.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
  ) {}
  async findByEmail(email: string): Promise<Auth | null> {
    return await this.authRepository.findOne({ where: { email } });
  }
  async findById(id: string): Promise<Auth | null> {
    return await this.authRepository.findOne({ where: { id } });
  }
  async login(request: LoginDTO): Promise<{ accessToken: string }> {
    const user = await this.findByEmail(request.email);
    if (!user)
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác !');
    const isMatch = await bcrypt.compare(request.password, user.password_hash);
    if (!isMatch)
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác !');
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url ?? '',
    };
    const token: string = this.jwtService.sign(payload);
    return { accessToken: token };
  }
  async register(request: RegisterDTO): Promise<{ message: string }> {
    const isExist = await this.findByEmail(request.email);
    if (isExist) throw new BadRequestException('Email này đã được sử dụng !');
    const hashedPassword = await bcrypt.hash(request.password, 10);
    const newUser = this.authRepository.create({
      email: request.email,
      name: request.name,
      avatar_url: request.avatar_url,
      password_hash: hashedPassword,
    });
    await this.authRepository.save(newUser);
    return { message: 'Đăng kí tài khoản thành công' };
  }
  async getUsers(): Promise<UserDto[]> {
    return this.authRepository.find({
      select: {
        id: true,
        name: true,
      },
      order: {
        name: 'ASC',
      },
    });
  }
}
