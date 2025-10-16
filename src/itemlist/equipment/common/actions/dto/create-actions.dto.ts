import { IsString, Length } from 'class-validator';

export class CreateActionsDto {
  @IsString()
  @Length(1, 500)
  description: string;
}
