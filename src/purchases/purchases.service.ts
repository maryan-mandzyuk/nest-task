import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { emailData } from 'src/AppConfig';
import { ERROR_MESSAGES } from 'src/constants';
import { Product } from 'src/products/product.entity';
import { Connection, Repository } from 'typeorm';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { CreatePurchaseItemDto } from './dto/create-purchaseItem.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
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
    private readonly mailerService: MailerService,
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

        const orderData: {
          sellerEmail: string;
          products: string[];
        }[] = await purchaseItemRepositoryTransaction.query(`
        SELECT distinct users.email, array_agg(product.name || ': ' || purchase_item.quantity) as products
        FROM users 
        JOIN product ON product.user_id = users.id
        JOIN purchase_item ON product.id = purchase_item.product_id
        WHERE purchase_item.purchase_id = ${purchase.id} AND product.id IN (${productIds})
        GROUP BY users.email`);

        orderData.forEach((item) => {
          this.mailerService.sendMail({
            to: item.sellerEmail,
            subject: emailData.confirmMessageSubject,
            text: emailData.confirmMessageText,
            html: `<div>
              <p>You received new order from customer email: ${purchase.email} address: ${purchase.address} phone number: ${purchase.phoneNumber}</p>
              <p>Products ordered: ${item.products}</p>
             </div>`,
          });
        });

        await this.mailerService.sendMail({
          to: purchase.email,
          subject: emailData.confirmMessageSubject,
          text: emailData.confirmMessageText,
          html: `<div>
            <p>You order created, Address: ${purchase.address}, Phone number: ${
            purchase.phoneNumber
          }</p>
            <p>Products ordered: ${orderData.map(
              (item) => `${item.products} `,
            )}</p>
           </div>`,
        });

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

  public handleUpdate(
    id: string,
    purchaseDto: UpdatePurchaseDto,
  ): Promise<Purchase> {
    return this.connection.transaction(async (manager) => {
      try {
        const purchaseRepositoryTransaction = manager.getRepository<Purchase>(
          Purchase,
        );

        const purchaseItemRepositoryTransaction = manager.getRepository<PurchaseItem>(
          PurchaseItem,
        );
        // TODO update purchase item
        const purchase = await purchaseRepositoryTransaction.findOneOrFail(id);
        const updatedPurchase = purchaseRepositoryTransaction.create({
          ...purchase,
          ...purchaseDto,
        });
        return updatedPurchase;
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
