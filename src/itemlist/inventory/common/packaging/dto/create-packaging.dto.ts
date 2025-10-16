import { IsString, Length } from 'class-validator';

export class CreatePackagingDto {
  @IsString()
  @Length(1, 50)
  name: string;
}
