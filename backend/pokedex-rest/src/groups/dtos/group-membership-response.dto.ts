import { ApiProperty } from '@nestjs/swagger';

export class GroupMembershipResponseDto {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'The id of the list the Pokemon is saved in',
  })
  groupId: string;

  @ApiProperty({
    example: '25',
    description: 'The id of the saved Pokemon',
  })
  pokemonId: string;
}
