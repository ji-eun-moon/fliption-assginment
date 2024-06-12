import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { SearchOptionDTO } from './search-option.dto';
import { PageInfoDTO } from './page-info.dto';

@ApiExtraModels(SearchOptionDTO)
export class SearchResponseDTO {
  @ApiProperty({ type: 'any', isArray: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];

  @ApiProperty({ type: PageInfoDTO })
  pageInfo: PageInfoDTO;
}
