import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from 'src/users/user.entity';
import { ERROR_MESSAGES } from 'src/constants';
import { appConfig } from 'src/AppConfig';
import { FindProductQueryDto } from './dto/find-froduct.dto';
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async handleFindByUser(
    userId,
    { orderPrice = 'ASC', page = 1 }: FindProductQueryDto,
  ): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.user_id = :userId', { userId })
      .andWhere('product.isDeleted = false')
      .skip(appConfig.PRODUCTS_PER_PAGE * (page - 1))
      .take(appConfig.PRODUCTS_PER_PAGE)
      .orderBy({ price: orderPrice })
      .getMany();
  }

  public handleFindById(id: number): Promise<Product> {
    return this.productRepository.findOneOrFail(id);
  }

  public handelCreate(
    productDto: CreateProductDto,
    user: User,
  ): Promise<Product> {
    return this.productRepository.save({ ...productDto, user });
  }

  public async handleDelete(id: number, userId: number): Promise<Product> {
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
    userId: number,
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
