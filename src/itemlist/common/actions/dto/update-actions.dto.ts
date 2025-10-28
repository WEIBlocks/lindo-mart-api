import { IsString, IsOptional, Length, IsEnum } from 'class-validator';

export class UpdateActionsDto {
  @IsOptional()
  @IsString()
  @Length(1, 500)
  description?: string;

  @IsOptional()
  @IsEnum([
    'equipment',
    'operational-alerts',
    'handover-alerts',
    'customer-feedback',
    'health-safety',
    'disaster-preparedness'
  ])
  type?: string;
}
