import { IsNotEmpty, IsNumber, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateProductDto {
  @IsNumber({}, { message: 'Price must be a valid numeric decimal asset' })
  @IsNotEmpty()
  @IsOptional() 
  price?: number;

  @IsInt({ message: 'Stock must be a whole integrated integer' })
  @Min(0)
  @IsNotEmpty()
  @IsOptional()
  stock_quantity?: number;
}