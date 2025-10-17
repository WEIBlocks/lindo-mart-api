import { 
  IsString, 
  IsOptional, 
  Length
} from 'class-validator';

export class UpdateEquipmentDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  itemName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  description?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  category?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  subcategory?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  location?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  maintenanceNotes?: string;
}
