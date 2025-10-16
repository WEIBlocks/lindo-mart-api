import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateActionsDto {
  @IsOptional()
  @IsString()
  @Length(1, 500)
  description?: string;
}
