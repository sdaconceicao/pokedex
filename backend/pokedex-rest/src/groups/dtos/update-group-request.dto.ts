import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGroupRequestDto {
  @ApiPropertyOptional({ example: 'My Team', description: 'New group name' })
  name?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Set this group as the default',
  })
  isDefault?: boolean;
}
