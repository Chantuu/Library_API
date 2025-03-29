import {
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class PostAuthorBodyDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @IsString()
  @IsOptional()
  biography?: string;

  @IsDateString()
  @IsOptional()
  birthDate?: string;
}
