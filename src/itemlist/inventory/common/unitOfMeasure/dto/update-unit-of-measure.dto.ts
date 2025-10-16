import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateUnitOfMeasureDto {
  @IsOptional()
  @IsString()
  @Length(1, 50)
  fullName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 10)
  shortName?: string;
}
