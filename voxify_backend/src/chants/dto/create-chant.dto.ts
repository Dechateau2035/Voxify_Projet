import { IsString, IsOptional } from 'class-validator';

export class CreateChantDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  lyrics?: string;
}