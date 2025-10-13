import { 
  IsString, 
  IsBoolean, 
  IsOptional, 
  IsEnum, 
  Length
} from 'class-validator';

export class CreateInventoryDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @Length(1, 500)
  description: string;

  @IsEnum([
    'Pieces', 'Boxes', 'Cartons', 'Bags', 'Bottles', 'Cans', 
    'Packets', 'Rolls', 'Sheets', 'Units', 'Kilograms', 
    'Grams', 'Liters', 'Meters'
  ], { message: 'Invalid unit of measure' })
  unitOfMeasure: string;

  @IsEnum([
    '1', '2', '3', '4', '5', '6', '8', '10', '12', '15', '20', '24', 
    '25', '30', '36', '48', '50', '60', '72', '100', '120', '144', 
    '200', '250', '300', '500', '1000'
  ], { message: 'Invalid units per package' })
  unitsPerPackage: string;

  @IsString()
  @Length(1, 10)
  reorderLevel: string;

  @IsBoolean()
  perishable: boolean;

  @IsBoolean()
  essential: boolean;
}