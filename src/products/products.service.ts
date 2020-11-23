import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Product } from './product.entity';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

 
  public async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  public async findById(id: number): Promise<Product | null> {
    return await this.productRepository.findOneOrFail(id);
  }

  public async create(productDto: CreateProductDto): Promise<Product> {
    return await this.productRepository.save(productDto);
  }

  public async delete(id: number): Promise<DeleteResult> {      
    return await this.productRepository.delete(id);
  }

  public async update(id: number, productDto: CreateProductDto): Promise<Product> {
    const product = await this.productRepository.findOne({
        where: { id }
      });
      
      return this.productRepository.save({
        ...product,
        ...productDto
      });
  }
}
