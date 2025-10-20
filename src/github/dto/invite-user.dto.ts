import { IsNotEmpty, IsString } from 'class-validator';

export class InviteUserDto {
  @IsString()
  @IsNotEmpty()
  identifier: string;
}
