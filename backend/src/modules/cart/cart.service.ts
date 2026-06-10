import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-items.entity';
import { Product } from '../product/entities/product.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';

import { CACHE_KEYS } from '../../common/constants/cache.constants';
import { RedisService } from '../../common/service/redis.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly redisService: RedisService,
  ) { }

  async getCart(userId: string): Promise<CartItem[]> {
    const cartItems = await this.cartItemRepository.find({
      where: { userId },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });

    await this.redisService.set(`${CACHE_KEYS.CART}:${userId}`, cartItems, 300);
    return cartItems;
  }

  async addToCart(userId: string, dto: AddToCartDto): Promise<void> {
    const { productId, quantity = 1 } = dto;

    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    let cartItem = await this.cartItemRepository.findOne({
      where: { userId, productId },
    });

    const targetQuantity = cartItem ? cartItem.quantity + quantity : quantity;

    if (product.stock_quantity < targetQuantity) {
      throw new BadRequestException(
        `Product is Out of Stock.`
      );
    }

    if (cartItem) {
      cartItem.quantity = targetQuantity;
    } else {
      cartItem = this.cartItemRepository.create({
        userId,
        productId,
        quantity,
      });
    }

    await this.cartItemRepository.save(cartItem);
  }

  async updateQuantity(userId: string, cartItemId: string, quantity: number): Promise<void> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId, userId },
      relations: ['product'],
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found.');
    }

    if (cartItem.product.stock_quantity < quantity) {
      throw new BadRequestException(
        `No More Stock Available for this Product.`
      );
    }

    cartItem.quantity = quantity;
    await this.cartItemRepository.save(cartItem);
    await this.invalidateCartCache(userId);

  }

  async removeFromCart(userId: string, cartItemId: string): Promise<void> {
    const result = await this.cartItemRepository.delete({ id: cartItemId, userId });

    if (result.affected === 0) {
      throw new NotFoundException('Cart item not found.');
    }
    await this.invalidateCartCache(userId);
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartItemRepository.delete({ userId });
    await this.invalidateCartCache(userId);
  }

  async invalidateCartCache(userId: string): Promise<void> {
    return this.redisService.del(`${CACHE_KEYS.CART}:${userId}`);
  }
}