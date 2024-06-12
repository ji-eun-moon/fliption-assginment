import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { PasswordMatch } from '../validators/password-match.validator';

export class CreateUserDTO {
  @IsNotEmpty({ message: '아이디를 입력해 주세요.' })
  @ApiProperty({ description: '아이디', example: 'username' })
  username: string;

  @IsNotEmpty({ message: '연락처를 입력해 주세요.' })
  @ApiProperty({ description: '연락처', example: '010-1234-5678' })
  contact: string;

  @IsNotEmpty({ message: '비밀번호를 입력해 주세요.' })
  @ApiProperty({ description: '비밀번호', example: 'password' })
  password: string;

  @IsNotEmpty({ message: '비밀번호를 다시 한 번 입력해 주세요.' })
  @ApiProperty({ description: '비밀번호 확인', example: 'password' })
  @Validate(PasswordMatch)
  passwordConfirm: string;
}
