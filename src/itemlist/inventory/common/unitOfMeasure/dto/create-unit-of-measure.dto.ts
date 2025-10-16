import { IsString, Length } from 'class-validator';

export class CreateUnitOfMeasureDto {
  @IsString()
  @Length(1, 50)
  fullName: string;

  @IsString()
  @Length(1, 10)
  shortName: string;
}
