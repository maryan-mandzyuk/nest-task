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
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist';
import { AuthGuard } from 'src/auth/auth.guard';
import { CustomRequest } from 'src/auth/auth.interfaces';
import { AuthHelper } from 'src/auth/authHelper';
import { ID_PARAM, TOKEN_KEY, TOKEN_TYPES } from 'src/constants';
import { UsersService } from 'src/users/users.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductQueryDto } from './dto/find-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
@ApiTags('products')
@ApiBearerAuth()
@UseGuards(new AuthGuard(TOKEN_TYPES.ACCESS))
@Controller('products')
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private usersService: UsersService,
  ) {}

  @Get('/me')
  @ApiQuery({
    type: FindProductQueryDto,
  })
  @ApiResponse({
    type: [Product],
    status: 200,
  })
  findAll(
    @Request() req,
    @Query() query: FindProductQueryDto,
  ): Promise<Product[]> {
    const token = AuthHelper.getTokenFromRequest(req, TOKEN_KEY.ACCESS);

    const { userId } = AuthHelper.decodeTokenPayload(token);

    return this.productsService.handleFindByUser(userId, { ...query });
  }

  @Get('/:id')
  @ApiParam(ID_PARAM)
  @ApiResponse({
    type: Product,
    status: 200,
  })
  findById(@Param() params): Promise<Product> {
    return this.productsService.handleFindById(params.id);
  }

  @Post()
  @ApiBody({ type: CreateProductDto })
  @ApiCreatedResponse({
    type: Product,
  })
  async create(
    @Body() createProductDto: CreateProductDto,
    @Request() req,
  ): Promise<Product> {
    try {
      const token = AuthHelper.getTokenFromRequest(req, TOKEN_KEY.ACCESS);

      const { userId } = AuthHelper.decodeTokenPayload(token);

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
  @ApiBody({ type: UpdateProductDto })
  @ApiParam({ type: 'string', name: 'id' })
  @ApiResponse({
    type: Product,
    status: 200,
  })
  update(
    @Body() updateProductDto: UpdateProductDto,
    @Param() params,
    @Request() req,
  ): Promise<Product> {
    const token = AuthHelper.getTokenFromRequest(req, TOKEN_KEY.ACCESS);

    const { userId } = AuthHelper.decodeTokenPayload(token);

    return this.productsService.handleUpdate(
      params.id,
      userId,
      updateProductDto,
    );
  }

  @Delete('/:id')
  @ApiParam({ type: 'string', name: 'id' })
  @ApiResponse({
    type: Product,
    status: 200,
  })
  delete(@Param() params, @Request() req: CustomRequest): Promise<Product> {
    const token = AuthHelper.getTokenFromRequest(req, TOKEN_KEY.ACCESS);
    const { userId } = AuthHelper.decodeTokenPayload(token);
    return this.productsService.handleDelete(params.id, userId);
  }
}
