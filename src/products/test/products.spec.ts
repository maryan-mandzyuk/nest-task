import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

      const foundUser = await productService.handleFindById(id);
      expect(findSpy).toBeCalledWith(id);
      expect(foundUser).toEqual(product);
      expect.assertions(2);
    });
  });
});
