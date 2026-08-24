import { ApiProperty } from '@nestjs/swagger';

export class EmailVerificationResponseDTO {
  @ApiProperty({
    example:
      'If an unverified account exists for that address, a new link has been sent',
    description:
      'Always identical whether or not the address is registered or already verified, so the endpoint cannot be used to enumerate accounts',
  })
  message: string;
}
