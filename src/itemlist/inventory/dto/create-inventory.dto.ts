import { 
  IsString, 
  IsBoolean, 
  IsOptional, 
  IsNumber,
  IsMongoId,
  Min,
  Length
} from 'class-validator';

export class CreateInventoryDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @Length(1, 500)
  description: string;

  @IsString()
  @Length(1, 50)
  unitOfMeasure: string;

  @IsNumber()
  @Min(0)
  unitsPerPackage: number;

  @IsString()
  @Length(1, 10)
  reorderLevel: string;

  @IsBoolean()
  perishable: boolean;

  @IsBoolean()
  essential: boolean;

  @IsString()
  @Length(1, 50)
  category: string;

  @IsString()
  @Length(1, 50)
  subcategory: string;
}