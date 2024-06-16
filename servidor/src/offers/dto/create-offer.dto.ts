import {
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { OfferCondition } from '../entities';

export class CreateOfferDto {
  @IsNotEmpty()
  @IsString()
  cardId: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsEnum(OfferCondition)
  condition: OfferCondition;

  @IsNumber()
  price: number;
}
