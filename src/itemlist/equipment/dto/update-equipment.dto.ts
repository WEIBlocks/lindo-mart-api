import { 
  IsString, 
  IsOptional, 
  IsEnum, 
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
  @IsEnum([
    'Equipment Alert',
    'Facility Alert'
  ], { message: 'Invalid category' })
  category?: string;

  @IsOptional()
  @IsEnum([
    'Freezer/Chiller',
    'Scales', 
    'Other',
    'Restrooms',
    'Electricals',
    'Flooding'
  ], { message: 'Invalid subcategory' })
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
