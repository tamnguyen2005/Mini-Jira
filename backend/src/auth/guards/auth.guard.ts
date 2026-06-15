import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
export interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  avatar_url: string;
}
export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException('Không tìm thấy token');
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }
  extractTokenFromHeader(request: Request): string | undefined {
    const authorized = request.headers.authorization;
    if (!authorized) return undefined;
    const [type, token] = authorized.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
