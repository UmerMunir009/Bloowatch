import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@CurrentUser('id') userId: string) {
    const items = await this.cartService.getCart(userId);
    return { 
      success: true,
      message: 'Cart fetched successfully',
      data: items
     };
  }
  
  @Post()
  async addToCart(
    @CurrentUser('id') userId: string, 
    @Body() addToCartDto: AddToCartDto
  ) {
    await this.cartService.addToCart(userId, addToCartDto);
    return { 
      success: true, 
      message: 'Item added to cart'
     };
  }

  @Patch(':id')
  async updateQuantity(
    @CurrentUser('id') userId: string,
    @Param('id') cartItemId: string,
    @Body() updateQuantityDto: UpdateQuantityDto,
  ) {
    await this.cartService.updateQuantity(userId, cartItemId, updateQuantityDto.quantity);
    return { 
      success: true, 
      message: 'Cart allocation quantities updated.' 
    };
  }

  @Delete(':id')
  async removeFromCart(
    @CurrentUser('id') userId: string, 
    @Param('id') cartItemId: string
  ) {
    await this.cartService.removeFromCart(userId, cartItemId);
    return { success: true, message: 'Item removed from cart.' };
  }
  
  @Delete()
  async clearCart(@CurrentUser('id') userId: string) {
    await this.cartService.clearCart(userId);
    return { success: true, message: 'Cart cleared successfully.' };
  }
}