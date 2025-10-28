import { IsString, Length, IsEnum } from 'class-validator';

export class CreateActionsDto {
  @IsString()
  @Length(1, 500)
  description: string;

  @IsEnum([
    'equipment',
    'operational-alerts',
    'handover-alerts',
    'customer-feedback',
    'health-safety',
    'disaster-preparedness',
  ])
  type: string;
}
