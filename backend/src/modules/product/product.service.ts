import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoryService } from '../category/category.service';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ProductFilterDto } from './dto/product-filter.dto';

import { RedisService } from '../../common/service/redis.service';
import { CACHE_KEYS } from '../../common/constants/cache.constants';


@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoryService,
    private readonly redisService: RedisService,
  ) { }

  private async uploadImageToCloudinary(file: any): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'bloowatch_products' },
        (error, result) => {
          if (error) return reject(error);
          if (!result) {
            return reject(new Error('Cloudinary upload stream returned an empty response.'));
          }

          resolve(result);
        },
      );
      uploadStream.end(file.buffer);
    });
  }

  async create(createProductDto: CreateProductDto, files: any[]): Promise<Product> {
    const category = await this.categoryService.findOne(createProductDto.categoryId);
    if (!category) {
      throw new NotFoundException(`Category with ${createProductDto.categoryId} not found`);
    }

    const existingProduct = await this.productRepository.findOne({
      where: { name: createProductDto.name }
    });

    if (existingProduct) {
      throw new ConflictException('Product with this name already exists');
    }

    const imageUrls: string[] = [];
    if (files && files.length > 0) {
      const uploadPromises = files.map((file) => this.uploadImageToCloudinary(file));
      const uploadResults = await Promise.all(uploadPromises);
      uploadResults.forEach((result) => imageUrls.push(result.secure_url));
    }

    const product = this.productRepository.create({
      ...createProductDto,
      images: imageUrls,
    });

    await this.invalidateProductsCache();

    return await this.productRepository.save(product);
  }

  async findAll(filterDto: ProductFilterDto) {
    const { limit, page, search, categoryId, minPrice, maxPrice } = filterDto;

    const cacheKey = `${CACHE_KEYS.ALL_PRODUCTS}:page=${page}:limit=${limit}:minPrice=${minPrice}:maxPrice=${maxPrice}:search=${search || ''}:category=${categoryId || ''}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return cached as any;
    }
    const whereConditions: any = {};
    if (categoryId) {
      whereConditions.categoryId = categoryId;
    }

    if (search) {
      whereConditions.name = ILike(`%${search}%`);
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      whereConditions.price = Between(minPrice, maxPrice);
    }

    const [products, totalItems] = await this.productRepository.findAndCount({
      where: whereConditions,
      relations: ['category'],
      order: { createdAt: 'DESC' },
      skip: filterDto.skip,
      take: limit,
    });
    const result = {
      data: products,
      meta: {
        totalItems,
        itemCount: products.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: filterDto.page,
      },
    };
    await this.redisService.set(cacheKey, result, 300);
    return result;
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    Object.assign(product, {
      ...updateProductDto,
      price: updateProductDto.price !== undefined ? updateProductDto.price : product.price,
      stock_quantity: updateProductDto.stock_quantity !== undefined ? updateProductDto.stock_quantity : product.stock_quantity,
    });

    try {
      await this.invalidateProductsCache();
      return await this.productRepository.save(product);
      
    } catch (error) {
      throw new ConflictException('Product compilation clash: Name or Slug might conflict');
    }
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    await this.invalidateProductsCache();
  }



   private async invalidateProductsCache(): Promise<void> {
    const keys = await this.redisService.keys(
      `${CACHE_KEYS.ALL_PRODUCTS}*`,
    );
    await Promise.all(keys.map((key) => this.redisService.del(key)));
  }
}