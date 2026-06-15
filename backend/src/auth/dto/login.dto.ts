import { IsEmail, IsNotEmpty } from 'class-validator';
export class LoginDTO {
  @IsNotEmpty({ message: 'Email không thể bỏ trống' })
  @IsEmail()
  email!: string;
  @IsNotEmpty({ message: 'Mật khẩu không thể bỏ trống' })
  password!: string;
}
