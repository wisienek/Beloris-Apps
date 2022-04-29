import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    type: 'string',
    description: `User's name`,
    example: 'admin',
  })
  username!: string;

  @ApiProperty({
    type: 'string',
    description: `User's password`,
    example: 'password123',
  })
  password!: string;
}
