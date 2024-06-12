import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserLoginDTO {
  @ApiProperty({ description: '아이디', example: 'username' })
  @IsNotEmpty({ message: '아이디를 입력해 주세요.' })
  username: string;

  @ApiProperty({ description: '비밀번호', example: 'password' })
  @IsNotEmpty({ message: '비밀번호를 입력해 주세요.' })
  password: string;
}
