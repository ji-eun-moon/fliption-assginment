import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { randomUUID } from 'crypto';

@Exclude()
export class UserDTO {
  @Expose()
  @ApiProperty({ description: 'ID', example: randomUUID() })
  id: string;

  @Expose()
  @ApiProperty({ description: '아이디', example: 'username' })
  username: string;

  @Expose()
  @ApiProperty({ description: '연락처', example: '010-1234-5678' })
  contact: string;

  @Expose()
  @ApiProperty({ description: '등록일시', type: 'Date' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: '수정일시', type: 'Date' })
  updatedAt: Date;
}
