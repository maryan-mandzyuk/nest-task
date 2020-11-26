import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private usersService: UsersService,
  ) {}

  @Get('/user/:id')
  findAll(@Param() params): Promise<Product[]> {
    return this.productsService.findByUser(params.id);
  }

  @Get('/:id')
  findById(@Param() params): Promise<Product> {
    return this.productsService.findById(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @Request() req,
  ): Promise<Product> {
    const { userId } = req.user;
    const user = await this.usersService.findById(userId);

    return this.productsService.create(createProductDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  update(
    @Body() updateProductDto: UpdateProductDto,
    @Param() params,
    @Request() req,
  ): Promise<Product> {
    const { userId } = req.user;
    return this.productsService.update(params.id, userId, updateProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  delete(@Param() params, @Request() req) {
    const { userId } = req.user;
    return this.productsService.delete(params.id, userId);
  }
}
