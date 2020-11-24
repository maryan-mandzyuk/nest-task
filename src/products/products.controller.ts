import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UsersService } from "src/users/users.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./product.entity";
import { ProductsService } from "./products.service";

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService, private usersService: UsersService) {}

    @Get('/user/:id')
    async findAll(@Param() params): Promise<Product[]> {   
        return await this.productsService.findByUser(params.id);
    }
    
    @Get('/:id')
    async findById(@Param() params): Promise<Product> {   
        return await this.productsService.findById(params.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createProductDto: CreateProductDto, @Request() req): Promise<Product>  {
        const { userId } = req.user;
        const user = await this.usersService.findById(userId);
        
        return await this.productsService.create(createProductDto, user);
    }

    @UseGuards(JwtAuthGuard)
    @Put('/:id')
    async update(@Body() updateProductDto: UpdateProductDto, @Param() params, @Request() req): Promise<Product> {
        const { userId } = req.user;
        return await this.productsService.update(params.id, userId, updateProductDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    async delete(@Param() params, @Request() req) {
        const { userId } = req.user;
        return await this.productsService.delete(params.id, userId);
    }
}