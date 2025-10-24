import { IsString, IsArray, IsEnum, IsOptional, ArrayMinSize, ArrayNotEmpty } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty({ message: 'At least one subcategory is required' })
  @ArrayMinSize(1, { message: 'At least one subcategory is required' })
  @IsString({ each: true })
  subcategories?: string[];

  @IsOptional()
  @IsEnum(['inventory', 'equipment', 'operational-alerts'])
  type?: string;
}
