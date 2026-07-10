import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ description: 'JWT issued-at time (seconds since epoch)' })
  iat: number;

  @ApiProperty({ description: 'JWT expiration time (seconds since epoch)' })
  exp: number;
}
