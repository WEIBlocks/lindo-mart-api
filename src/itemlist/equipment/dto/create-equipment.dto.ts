import { 
  IsString, 
  IsOptional, 
  Length
} from 'class-validator';

export class CreateEquipmentDto {
  @IsString()
  @Length(1, 100)
  name: string;

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
  @Length(1, 100)
  location: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  maintenanceNotes?: string;
}
