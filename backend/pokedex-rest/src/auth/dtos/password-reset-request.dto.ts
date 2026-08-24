import { ApiProperty } from '@nestjs/swagger';

export class PasswordResetRequestDto {
  @ApiProperty({
    example: 'ash.ketchum@pallet.town',
    description: 'Email address to send a password reset link to',
  })
  email: string;
}
