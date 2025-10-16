import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateReasonCodeDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  description?: string;
}
