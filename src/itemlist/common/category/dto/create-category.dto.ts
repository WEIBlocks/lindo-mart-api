import { IsString, IsArray, IsEnum, IsOptional, ArrayMinSize, ArrayNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'At least one subcategory is required' })
  @ArrayMinSize(1, { message: 'At least one subcategory is required' })
  @IsString({ each: true })
  subcategories: string[];

  @IsEnum(['inventory', 'equipment', 'operational-alerts'])
  type: string;
}
