import { IsString, Length, IsEnum } from 'class-validator';

export class CreateActionsDto {
  @IsString()
  @Length(1, 500)
  description: string;

  @IsEnum(['equipment', 'operational-alerts'])
  type: string;
}
