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
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist';
import { Response as ExpressResponse } from 'express';
import { appConfig } from 'src/AppConfig';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CustomRequest } from 'src/auth/auth.interfaces';
import { AuthHelper } from 'src/auth/authHelper';
import { ID_PARAM, TOKEN_KEY, TOKEN_TYPES, USER_ROLES } from 'src/constants';
import { UsersService } from 'src/users/users.service';
import { ApiFile } from './decorators/apiFile.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductQueryDto } from './dto/find-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import { Roles } from 'src/auth/roles.decorator';
@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private usersService: UsersService,
  ) {}

  @Get('/me')
  @UseGuards(new AuthGuard(TOKEN_TYPES.ACCESS))
  @Roles(USER_ROLES.seller)
  @ApiQuery({
    type: FindProductQueryDto,
  })
  @ApiResponse({
    type: [Product],
    status: 200,
  })
  findProductsByUser(
    @Request() req,
    @Query() query: FindProductQueryDto,
  ): Promise<Product[]> {
    const token = AuthHelper.getTokenFromRequest(req, TOKEN_KEY.ACCESS);
    const { userId } = AuthHelper.decodeTokenPayload(token);

    return this.productsService.handleFindProducts({ ...query }, userId);
  }

  @Get('')
  @ApiQuery({
    type: FindProductQueryDto,
  })
  @ApiResponse({
    type: [Product],
    status: 200,
  })
  findAllProducts(
    @Request() req,
    @Query() query: FindProductQueryDto,
  ): Promise<Product[]> {
    return this.productsService.handleFindProducts({ ...query });
  }
  @Get('/export')
  @UseGuards(new AuthGuard(TOKEN_TYPES.ACCESS))
  @Roles(USER_ROLES.seller)
  @ApiQuery({
    type: FindProductQueryDto,
  })
  exportCsv(
    @Request() req,
    @Query() query: FindProductQueryDto,
    @Response() res,
  ): Promise<ExpressResponse> {
    const token = AuthHelper.getTokenFromRequest(req, TOKEN_KEY.ACCESS);
    const { userId } = AuthHelper.decodeTokenPayload(token);
    return this.productsService.handleCsvExport(userId, res, { ...query });
  }

  @Post('/import')
  @UseGuards(new AuthGuard(TOKEN_TYPES.ACCESS))
  @Roles(USER_ROLES.seller)
  @ApiConsumes('multipart/form-data')
  @ApiFile(appConfig.PRODUCTS_IMPORT_FILE)
  @UseInterceptors(FileInterceptor(appConfig.PRODUCTS_IMPORT_FILE))
  async importCsv(@Request() req, @UploadedFile() file): Promise<void> {
    const token = AuthHelper.getTokenFromRequest(req, TOKEN_KEY.ACCESS);

    const { userId } = AuthHelper.decodeTokenPayload(token);

    const user = await this.usersService.handleFindById(userId);
    this.productsService.handelCsvImport(user, file);
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
  @UseGuards(new AuthGuard(TOKEN_TYPES.ACCESS))
  @Roles(USER_ROLES.seller)
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
  @UseGuards(new AuthGuard(TOKEN_TYPES.ACCESS))
  @Roles(USER_ROLES.seller)
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
  @UseGuards(new AuthGuard(TOKEN_TYPES.ACCESS))
  @Roles(USER_ROLES.seller)
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
