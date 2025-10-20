import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveUserDto {
  @IsString()
  @IsNotEmpty()
  identifier: string;
}
