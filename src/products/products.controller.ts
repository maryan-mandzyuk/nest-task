import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./product.entity";
import { ProductsService } from "./products.service";

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) {}

    @Get()
    async findAll(): Promise<Product[]> {
        return await this.productsService.findAll();
    }

    @Post()
    async create(@Body() createProductDto: CreateProductDto): Promise<Product>  {
        return await this.productsService.create(createProductDto);
    }

    @Put('/:id')
    async update(@Body() updateProductDto: UpdateProductDto, @Param() params): Promise<Product> {
        return await this.productsService.update(params.id, updateProductDto);
    }

    @Delete('/:id')
    async delete(@Param() params) {
        return await this.productsService.delete(params.id);
    }
}