import { IsString, IsArray, IsOptional, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @Type(() => String)
  @IsString({ each: true })
  categories: string[];

  @IsOptional()
  @IsString()
  minimumLevel: string;

  @IsOptional()
  @IsArray()
  @Type(() => String)
  @IsString({ each: true })
  actionsNeeded: string[];
}
