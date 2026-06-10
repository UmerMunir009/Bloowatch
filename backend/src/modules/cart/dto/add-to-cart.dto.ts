import { IsUUID, IsInt, IsOptional, Min } from 'class-validator';

export class AddToCartDto {
  @IsUUID('4')
  productId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number = 1;
}