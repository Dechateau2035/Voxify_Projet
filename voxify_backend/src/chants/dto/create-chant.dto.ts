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

  /*@IsOptional()
  @IsString()
  audioUrl?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  voices?: {
    soprano?: string;
    alto?: string;
    tenor?: string;
    bass?: string;
  };*/
}