import { ApiProperty } from '@nestjs/swagger';

export class GroupResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'My Team' })
  name: string;

  @ApiProperty({ example: false })
  isDefault: boolean;

  @ApiProperty({ example: 6, description: 'Number of Pokemon in this list' })
  pokemonCount: number;
}
