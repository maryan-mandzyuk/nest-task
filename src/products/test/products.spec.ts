import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { USER_ROLES } from '../../constants';
import { Users } from '../../users/user.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../product.entity';
import { ProductsService } from '../products.service';
import { ProductsRepositoryFake } from './productsRepositoryFake';

describe('Products Service', () => {
  let productService: ProductsService;
  let productRepo: Repository<Product>;

  const product: Product = {
    createdAt: '10/12/2020',
    description: 'description bla bla',
    isDeleted: false,
    name: 'product for test',
    price: '30',
    property: [
      {
        name: 'test prop',
        value: '12',
      },
    ],
    id: '1',
  };

  const user: Users = {
    id: '1',
    userName: 'admin',
    email: 'mandzyuk.maryan@gmail.com',
    isEmailConfirmed: true,
    firstName: 'first name',
    lastName: 'last name',
    role: USER_ROLES.seller,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useClass: ProductsRepositoryFake,
        },
      ],
    }).compile();

    productService = moduleRef.get<ProductsService>(ProductsService);
    productRepo = moduleRef.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  describe('handleFindById', () => {
    const id = '1';
    it('should invoke handleFindById, expect to return product', async () => {
      const findSpy = jest
        .spyOn(productRepo, 'findOneOrFail')
        .mockResolvedValueOnce(product);

      const foundProduct = await productService.handleFindById(id);
      expect(findSpy).toBeCalledWith(id);
      expect(foundProduct).toEqual(product);
    });
  });

  describe('handleCreate', () => {
    const productDto: CreateProductDto = {
      name: 'new prod',
      price: '99',
      description: 'new prod description',
      property: [
        {
          name: 'color',
          value: 'white',
        },
      ],
    };

    it('Should crate new product, product dto provided right', async () => {
      const saveSpy = jest
        .spyOn(productRepo, 'save')
        .mockResolvedValueOnce({ ...product, ...productDto });

      const savedProduct = await productService.handelCreate(productDto, user);
      expect(saveSpy).toBeCalledWith({ ...productDto, user });
      expect(savedProduct).toMatchObject(productDto);
    });
  });
});
