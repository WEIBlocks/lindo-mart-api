import { IsString, IsOptional, Length } from 'class-validator';

export class UpdatePackagingDto {
  @IsOptional()
  @IsString()
  @Length(1, 50)
  name?: string;
}
