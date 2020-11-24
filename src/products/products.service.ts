import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from './product.entity';
import { Repository, DeleteResult, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

 
  public async findAll(userId: number): Promise<Product[]> {
    const product = await getRepository(Product)
    .createQueryBuilder('product')
    .where('product.user_id = :userId', {userId})
    .andWhere('product.isDeleted = false')
    .getMany();
    return product;
  }

  public async findById(id: number): Promise<Product | null> {
    return await this.productRepository.findOneOrFail(id);
  }

  public async create(productDto: CreateProductDto, user: User): Promise<Product> {    
    return await this.productRepository.save({...productDto, user});
  }

  public async delete(id: number, userId: number): Promise<Product> {   
    const product = await this.getProductByIdAndUserId(id, userId);

    if(!product) {
      throw new HttpException({message: 'Can not delete'}, HttpStatus.UNAUTHORIZED);
  }
    product.isDeleted = true;
    return await this.productRepository.save(product);
  }

  public async update(id: number, userId: number, productDto: UpdateProductDto): Promise<Product> {
    const product = await this.getProductByIdAndUserId(id, userId);
      
      return this.productRepository.save({
        ...product,
        ...productDto
      });
  }

  private async getProductByIdAndUserId(id: number, userId: number): Promise<Product> {
    const product = await getRepository(Product)
    .createQueryBuilder('product')
    .where('product.id = :id', { id })
    .andWhere('product.user_id = :userId', {userId})
    .getOne();
    return product;
  }
}
