import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from 'src/users/users.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
@UseGuards(AuthGuard)
@Controller('products')
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private usersService: UsersService,
  ) {}

  @Get('/me')
  findAll(@Request() req): Promise<Product[]> {
    const { userId } = req.user;
    return this.productsService.handleFindByUser(userId);
  }

  @Get('/:id')
  findById(@Param() params): Promise<Product> {
    return this.productsService.handleFindById(params.id);
  }

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @Request() req,
  ): Promise<Product> {
    try {
      const { userId } = req.user;
      const user = await this.usersService.handleFindById(userId);
      return this.productsService.handelCreate(createProductDto, user);
    } catch (e) {
      throw new HttpException(
        { message: e.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('/:id')
  update(
    @Body() updateProductDto: UpdateProductDto,
    @Param() params,
    @Request() req,
  ): Promise<Product> {
    const { userId } = req.user;
    return this.productsService.handleUpdate(
      params.id,
      userId,
      updateProductDto,
    );
  }

  @Delete('/:id')
  delete(@Param() params, @Request() req) {
    const { userId } = req.user;
    return this.productsService.handleDelete(params.id, userId);
  }
}
