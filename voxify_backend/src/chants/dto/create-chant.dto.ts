import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateChantDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  lyrics?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}