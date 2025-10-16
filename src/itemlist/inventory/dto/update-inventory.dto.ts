import { 
  IsString, 
  IsBoolean, 
  IsOptional, 
  IsNumber,
  IsMongoId,
  Min,
  Length
} from 'class-validator';

export class UpdateInventoryDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  description?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  unitOfMeasure?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  unitsPerPackage?: number;

  @IsOptional()
  @IsString()
  @Length(1, 10)
  reorderLevel?: string;

  @IsOptional()
  @IsBoolean()
  perishable?: boolean;

  @IsOptional()
  @IsBoolean()
  essential?: boolean;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  category?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  subcategory?: string;
}