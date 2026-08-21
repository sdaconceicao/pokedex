import { ApiProperty } from '@nestjs/swagger';

export class GroupPokemonResponseDto {
  @ApiProperty({ example: '25' })
  pokemonId: string;

  @ApiProperty({ example: '25' })
  speciesId: string;
}
