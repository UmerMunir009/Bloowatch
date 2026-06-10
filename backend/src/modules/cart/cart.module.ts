import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { CartItem } from './entities/cart-items.entity';
import { Product } from '../product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem,Product])],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService] 
})
export class CartModule {}