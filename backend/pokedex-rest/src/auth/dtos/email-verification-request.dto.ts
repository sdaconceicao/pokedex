import { ApiProperty } from '@nestjs/swagger';

export class EmailVerificationRequestDto {
  @ApiProperty({
    example: 'ash.ketchum@pallet.town',
    description: 'Email address to send a fresh verification link to',
  })
  email: string;
}
