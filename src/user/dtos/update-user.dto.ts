import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @ApiProperty({ description: '연락처', example: '010-1234-5678' })
  contact?: string;
}
