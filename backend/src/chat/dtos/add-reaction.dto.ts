import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class AddReactionDto {
  @ApiProperty({
    description:
      'Emoji để toggle reaction. Nếu đã reaction emoji này thì sẽ xóa, chưa thì sẽ thêm.',
    example: '👍',
  })
  @IsString()
  @IsNotEmpty({ message: 'Emoji không được để trống' })
  @MaxLength(10, { message: 'Emoji tối đa 10 ký tự' })
  emoji: string;
}
