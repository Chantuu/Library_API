import {
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class PatchAuthorBodyDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  biography?: string;

  @IsDateString()
  @IsOptional()
  birthDate?: string;
}
