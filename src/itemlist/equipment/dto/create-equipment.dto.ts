import { 
  IsString, 
  IsOptional, 
  IsEnum, 
  Length
} from 'class-validator';

export class CreateEquipmentDto {
  @IsString()
  @Length(1, 100)
  itemName: string;

  @IsString()
  @Length(1, 500)
  description: string;

  @IsEnum([
    'Equipment Alert',
    'Facility Alert'
  ], { message: 'Invalid category' })
  category: string;

  @IsEnum([
    'Freezer/Chiller',
    'Scales', 
    'Other',
    'Restrooms',
    'Electricals',
    'Flooding'
  ], { message: 'Invalid subcategory' })
  subcategory: string;

  @IsString()
  @Length(1, 100)
  location: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  maintenanceNotes?: string;
}
