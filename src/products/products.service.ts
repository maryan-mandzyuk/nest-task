import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from 'src/users/user.entity';
import { ERROR_MESSAGES, ORDER, PRODUCTS_PER_PAGE } from 'src/constants';
import { FindProductQueryDto } from './dto/find-product.dto';
import { write, parse } from 'fast-csv';
import { Response } from 'express';
import { appConfig } from 'src/AppConfig';
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async handleFindByUser(
    userId: string,
    { orderPrice = ORDER.ASC, page = 1, searchTerm }: FindProductQueryDto,
  ): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.user_id = :userId', { userId })
      .andWhere('product.isDeleted = false')
      .andWhere(searchTerm ? 'product.name ILIKE :searchTerm' : 'TRUE', {
        searchTerm: `%${searchTerm}%`,
      })
      .skip(PRODUCTS_PER_PAGE * (page - 1))
      .take(PRODUCTS_PER_PAGE)
      .orderBy({ price: orderPrice })
      .getMany();
  }

  public handleFindById(id: number): Promise<Product> {
    return this.productRepository.findOneOrFail(id);
  }

  public async handleCsvExport(
    userId: string,
    res: Response,
    { orderPrice = ORDER.ASC, page = 1, searchTerm = '' }: FindProductQueryDto,
  ): Promise<Response> {
    const products = await this.productRepository.query(`
      SELECT product.name, description, price, "createdAt" , string_agg(prop.name || ': ' || prop.value, ', ') as property
      FROM product, json_to_recordset(product.property) AS prop("name" text, "value" text)
      WHERE user_id = ${userId} and product.name ILIKE '%${searchTerm}%'
      GROUP BY id
      ORDER BY price ${orderPrice}
      LIMIT ${PRODUCTS_PER_PAGE} OFFSET ${PRODUCTS_PER_PAGE * (page - 1)};
    `);

    res.attachment(appConfig.PRODUCTS_EXPORT_FILE);
    return write(products, { headers: true }).pipe(res);
  }

  public async handelCsvImport(user: User, file: any): Promise<void> {
    const stream = parse({ headers: true }).on('data', (row) => {
      try {
        const propertyArray = row.property
          .split(',')
          .map((el: string) => el.split(':'));

        const propertyArrayOfJson = propertyArray.reduce(
          (acc, curr) => [...acc, { ['name']: curr[0], ['value']: curr[1] }],
          [],
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
    user: User,
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

  private async getProductByIdAndUserId(query): Promise<Product> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .where(query)
      .getOne();
    return product;
  }
}
