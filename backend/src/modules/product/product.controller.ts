import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  ParseUUIDPipe, 
  Delete, 
  HttpStatus, 
  HttpCode, 
  Query, 
  UseInterceptors, 
  UploadedFiles, 
  Patch,
  UsePipes,
  UseGuards
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoryValidationPipe } from '../../common/pipes/category-validation.pipe'; 
import { ProductFilterDto } from './dto/product-filter.dto';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 5))
  @UseGuards(AdminGuard)
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: any[],
  ) {
    const result = await this.productService.create(createProductDto, files);
    return {
      success: true,
      message: 'Product created with Cloudinary assets successfully',
      data: result,
    };
  }

  @Get()
  @UsePipes(CategoryValidationPipe)
  async findAll(
    @Query() filterDto: ProductFilterDto,
  ) {
    const result = await this.productService.findAll(filterDto);
    return {
      success: true,
      message: 'Products retrieved successfully',
      data: result,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.productService.findOne(id);
    return {
      success: true,
      message: 'Product retrieved successfully',
      data: result,
    };
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const result = await this.productService.update(id, updateProductDto);
    return {
      success: true,
      message: 'Product updated successfully',
      data: result,
    };
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.productService.remove(id);
    return {
      success: true,
      message: 'Product deleted successfully',
    };
  }
}
