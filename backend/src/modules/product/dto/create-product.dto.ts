import { IsNotEmpty, IsString, IsNumberString, IsOptional, IsUUID, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumberString()
  @IsNotEmpty()
  price: number ;

  @IsNumberString()
  @IsNotEmpty()
  stock_quantity: number ;
}