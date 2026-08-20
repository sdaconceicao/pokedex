import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGroupRequestDto {
  @ApiProperty({ example: 'My Team', description: 'Name of the group' })
  name: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Make this the default group',
  })
  isDefault?: boolean;
}
