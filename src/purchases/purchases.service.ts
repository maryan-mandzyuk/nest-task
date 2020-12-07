import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_MESSAGES } from 'src/constants';
import { Product } from 'src/products/product.entity';
import { Connection, Repository } from 'typeorm';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { CreatePurchaseItemDto } from './dto/create-purchaseItem.dto';
import { Purchase } from './entities/purchase.entity';
import { PurchaseItem } from './entities/purchaseItem.entity';
@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    @InjectRepository(PurchaseItem)
    private readonly purchaseItemRepository: Repository<PurchaseItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly connection: Connection,
  ) {}

  async handleCreate(purchaseDto: CreatePurchaseDto): Promise<Purchase> {
    return this.connection.transaction(async (manager) => {
      try {
        const purchaseRepositoryTransaction = manager.getRepository<Purchase>(
          Purchase,
        );

        const purchaseItemRepositoryTransaction = manager.getRepository<PurchaseItem>(
          PurchaseItem,
        );
        const purchase = await purchaseRepositoryTransaction.save(purchaseDto);

        const itemsToSave = await this.getPurchaseItemsArray(
          purchaseDto.purchaseItem,
          purchase,
        );

        await purchaseItemRepositoryTransaction.save(itemsToSave);

        return purchase;
      } catch (e) {
        throw new HttpException(
          { message: ERROR_MESSAGES.SERVER_ERROR, error: e },
          HttpStatus.BAD_REQUEST,
        );
      }
    });
  }

  private getPurchaseItem = async (
    item: CreatePurchaseItemDto,
    purchase: Purchase,
  ): Promise<PurchaseItem> => {
    const product = await this.productRepository.findOneOrFail(item.productId);
    const purchaseItem: PurchaseItem = {
      product,
      purchase,
      quantity: item.quantity,
    };
    return purchaseItem;
  };

  private getPurchaseItemsArray = async (
    purchaseItem: CreatePurchaseItemDto[],
    purchase: Purchase,
  ): Promise<PurchaseItem[]> => {
    return Promise.all(
      purchaseItem.map((item: CreatePurchaseItemDto) =>
        this.getPurchaseItem(item, purchase),
      ),
    );
  };
}
