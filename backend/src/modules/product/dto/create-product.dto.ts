import { IsNotEmpty, IsString, IsNumberString, IsOptional, IsUUID, MaxLength, IsArray} from 'class-validator';

export class CreateProductDto {
  @IsUUID('all', { each: true })
  @IsArray()
  @IsNotEmpty()
  categoryIds: string[];

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