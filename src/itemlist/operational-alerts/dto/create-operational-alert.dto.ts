import { IsString, Length } from 'class-validator';

export class CreateOperationalAlertDto {
  @IsString()
  @Length(1, 100)
  itemName: string;

  @IsString()
  @Length(1, 500)
  description: string;

  @IsString()
  @Length(1, 50)
  category: string;

  @IsString()
  @Length(1, 50)
  subcategory: string;

  @IsString()
  @Length(1, 200)
  actionNeeded: string;
}
