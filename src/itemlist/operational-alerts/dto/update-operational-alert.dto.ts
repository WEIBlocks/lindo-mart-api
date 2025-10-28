import { IsString, IsOptional, Length, IsIn } from 'class-validator';

export class UpdateOperationalAlertDto {
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
  @Length(1, 200)
  actionNeeded?: string;

  @IsOptional()
  @IsString()
  @IsIn(['operational-alerts', 'handover-alerts', 'customer-feedback', 'health-safety', 'disaster-preparedness'])
  type?: string;
}
