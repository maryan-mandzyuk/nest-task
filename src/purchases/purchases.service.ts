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

  public async handleCreate(purchaseDto: CreatePurchaseDto): Promise<Purchase> {
    return this.connection.transaction(async (manager) => {
      try {
        const purchaseRepositoryTransaction = manager.getRepository<Purchase>(
          Purchase,
        );

        const purchaseItemRepositoryTransaction = manager.getRepository<PurchaseItem>(
          PurchaseItem,
        );
        const purchase = await purchaseRepositoryTransaction.save(purchaseDto);

        const purchasesItemsToSave = await this.getPurchaseItemsArray(
          purchaseDto.purchaseItem,
          purchase,
        );

        const purchaseItems = await purchaseItemRepositoryTransaction.save(
          purchasesItemsToSave,
        );

        const productIds = purchaseItems.map((item) => item.product.id);

        const sellerEmails = await purchaseItemRepositoryTransaction.query(`
        SELECT distinct users.email
        FROM users 
        JOIN product ON product.user_id = users.id
        JOIN purchase_item ON product.id = purchase_item.product_id
        WHERE purchase_item.purchase_id = ${purchase.id} AND product.id IN (${productIds})`);

        console.log(sellerEmails);

        return purchase;
      } catch (e) {
        throw new HttpException(
          { message: ERROR_MESSAGES.SERVER_ERROR, error: e },
          HttpStatus.BAD_REQUEST,
        );
      }
    });
  }

  public handleFindById(id: string): Promise<Purchase> {
    return this.purchaseRepository
      .createQueryBuilder('purchase')
      .leftJoinAndSelect('purchase.purchaseItems', 'purchase_item')
      .leftJoinAndSelect('purchase_item.product', 'product')
      .where('purchase.id = :id', { id })
      .getOneOrFail();
  }

  public handleFindBySeller(id: string): Promise<Purchase[]> {
    return this.purchaseRepository
      .createQueryBuilder('purchase')
      .leftJoinAndSelect('purchase.purchaseItems', 'purchase_item')
      .leftJoinAndSelect('purchase_item.product', 'product')
      .leftJoin('product.user', 'users')
      .where('users.id = :id', { id })
      .getMany();
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
