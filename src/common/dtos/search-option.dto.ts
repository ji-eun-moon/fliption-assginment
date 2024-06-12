import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class SearchOptionDTO {
  @ApiProperty({ description: '페이지 번호' })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: '페이지 번호를 입력해주세요' })
  pageNo: number;

  @ApiProperty({ description: '페이지 크기' })
  @IsNumber()
  @IsNotEmpty({ message: '페이지 크기를 입력해주세요' })
  @Type(() => Number)
  pageSize: number;

  @ApiProperty({ description: '정렬 기준', required: false })
  @IsOptional()
  orderBy?: string;

  @ApiProperty({
    description: '정렬 방향',
    required: false,
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  align?: 'asc' | 'desc';

  @ApiProperty({ description: '검색어', required: false })
  @IsOptional()
  query?: string;
}
