import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddChannelMemberDto {
  @IsOptional()
  @IsEmail()
  @ApiProperty({ 
    example: 'user@example.com', 
    required: false,
    description: 'Email của user cần thêm vào channel'
  })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ 
    example: 'user-uuid-here', 
    required: false,
    description: 'ID của user cần thêm vào channel'
  })
  userId?: string;
}

