import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Users } from '../users/user.entity';
import { ERROR_MESSAGES, ORDER, PRODUCTS_PER_PAGE } from '../constants';
import { FindProductQueryDto } from './dto/find-product.dto';
import { write, parse } from 'fast-csv';
import { Response } from 'express';
import { appConfig } from '../AppConfig';
import { ProductsHelper } from './ProductsHelper';
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async handleFindProducts(
    query: FindProductQueryDto,
    userId?: string,
  ): Promise<Product[]> {
    return this.getProductsByQuery(query, userId);
  }

  public handleFindById(id: string): Promise<Product> {
    return this.productRepository.findOneOrFail(id);
  }

  public async handleCsvExport(
    userId: string,
    res: Response,
    query: FindProductQueryDto,
  ): Promise<Response> {
    const products = await this.getProductsByQuery(query, userId);

    const productsForCsv = products.map((product) => ({
      ...product,
      property: ProductsHelper.productPropertiesToObjects(product),
    }));

    res.attachment(appConfig.PRODUCTS_EXPORT_FILE);
    return write(productsForCsv, { headers: true }).pipe(res);
  }

  public async handelCsvImport(user: Users, file: any): Promise<void> {
    const stream = parse({ headers: true }).on('data', (row) => {
      try {
        const propertyArrayOfJson = ProductsHelper.generateProductPropertyObjectsFromCsv(
          row.property,
        );

        this.productRepository.save({
          ...row,
          property: propertyArrayOfJson,
          user,
        });
      } catch (e) {
        throw new HttpException(
          { message: ERROR_MESSAGES.SERVER_ERROR, error: e },
          HttpStatus.BAD_REQUEST,
        );
      }
    });

    stream.write(file.buffer);
    stream.end();
  }

  public handelCreate(
    productDto: CreateProductDto,
    user: Users,
  ): Promise<Product> {
    return this.productRepository.save({
      ...productDto,
      user,
    });
  }

  public async handleDelete(id: number, userId: string): Promise<Product> {
    const product = await this.getProductByIdAndUserId({ id, user: userId });

    if (!product) {
      throw new HttpException(
        { message: ERROR_MESSAGES.DELETE_PRODUCT },
        HttpStatus.UNAUTHORIZED,
      );
    }
    product.isDeleted = true;
    return this.productRepository.save(product);
  }

  public async handleUpdate(
    id: number,
    userId: string,
    productDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.getProductByIdAndUserId({ id, user: userId });
    return this.productRepository.save({
      ...product,
      ...productDto,
    });
  }

  private async getProductsByQuery(
    { orderPrice = ORDER.ASC, page = 1, searchTerm }: FindProductQueryDto,
    userId: string,
  ): Promise<Product[]> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.user', 'user')
      .where('product.isDeleted = false');

    if (userId) {
      query.andWhere('product.user_id = :userId', {
        userId,
      });
    }

    if (searchTerm) {
      query.andWhere('product.name ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      });
    }
    const products = await query
      .skip(PRODUCTS_PER_PAGE * (page - 1))
      .take(PRODUCTS_PER_PAGE)
      .orderBy('product.price', orderPrice)
      .getMany();

    return products;
  }

  private async getProductByIdAndUserId(query): Promise<Product> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .where(query)
      .getOne();
    return product;
  }
}
