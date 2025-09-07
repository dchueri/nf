import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { UserStatus } from '../schemas/user.schema';

export class BulkUpdateUserDto {
  @ApiProperty({
    description: 'IDs dos usuários',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    required: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  userIds: string[];

  @ApiProperty({
    description: 'Status dos usuários',
    example: UserStatus.ACTIVE,
    enum: UserStatus,
    default: UserStatus.ACTIVE,
    required: true,
  })
  @IsEnum(UserStatus)
  @IsNotEmpty()
  status: UserStatus;
}
