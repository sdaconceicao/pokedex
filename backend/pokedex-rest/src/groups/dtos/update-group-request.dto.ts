import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGroupRequestDto {
  @ApiPropertyOptional({ example: 'My Team', description: 'New list name' })
  name?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Set this list as the default',
  })
  isDefault?: boolean;
}
