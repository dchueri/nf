import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class InviteUserDto {
  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail({}, { message: 'Email deve ser válido' })
  email: string;
}