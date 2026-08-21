import { ApiProperty } from '@nestjs/swagger';

export class AddGroupPokemonRequestDto {
  @ApiProperty({ example: '25', description: 'Pokemon identifier' })
  pokemonId: string;

  @ApiProperty({ example: '25', description: 'Species identifier' })
  speciesId: string;
}
