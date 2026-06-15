import {
  IsNotEmpty,
  IsEmail,
  Length,
  IsString,
  IsOptional,
} from 'class-validator';

export class RegisterDTO {
  @IsNotEmpty({ message: 'Email không thể bỏ trống' })
  @IsEmail()
  email!: string;
  @IsNotEmpty({ message: 'Mật khẩu không thể bỏ trống' })
  @IsString({ message: 'Mật khẩu phải là chuỗi kí tự' })
  @Length(6, 12, { message: 'Mật khẩu phải nằm trong khoảng từ 6 - 12 kí tự' })
  password!: string;
  @IsNotEmpty({ message: 'Tên không thể bỏ trống' })
  @IsString({ message: 'Tên phải là chuỗi kí tự' })
  name!: string;
  @IsOptional()
  avatar_url?: string;
}
