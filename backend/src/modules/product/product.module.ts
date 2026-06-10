import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { CategoryModule } from '../category/category.module';
import { CloudinaryProvider } from '../../config/cloudinary.config';
import { Category } from '../category/entities/category.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Product,Category]),
    CategoryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, CloudinaryProvider],
  exports: [ProductService],
})
export class ProductModule {}