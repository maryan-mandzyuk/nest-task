import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  customerOrderHtml,
  EMAIL_MESSAGES,
  ERROR_MESSAGES,
  sellerOrderHtml,
} from 'src/constants';
import { Product } from 'src/products/product.entity';
import { Users } from 'src/users/user.entity';
import { Connection, DeleteResult, Repository } from 'typeorm';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { CreatePurchaseItemDto } from './dto/create-purchaseItem.dto';
import { ProductPurchaseDto } from './dto/product-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { UpdatePurchaseItemDto } from './dto/update-purchaseItem.dto';
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
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly connection: Connection,
    private readonly mailerService: MailerService,
  ) {}

  public async handleCreate(
    purchaseDto: CreatePurchaseDto,
  ): Promise<Purchase[]> {
    return this.connection.transaction(async () => {
      try {
        const purchases: Purchase[] = await this.saveArrayPurchases(
          purchaseDto,
        );

        this.sendMailsForSellers(purchases);

        const purchaseItems = await this.purchaseItemRepository
          .createQueryBuilder('purchase_item')
          .leftJoinAndSelect('purchase_item.product', 'product')
          .where('purchase_item.purchase_id IN (:...purchaseIds)', {
            purchaseIds: purchases.map((p) => p.id),
          })
          .getMany();

        await this.mailerService.sendMail({
          to: purchaseDto.email,
          subject: EMAIL_MESSAGES.customerOrderSubject,
          text: EMAIL_MESSAGES.customerOrderText,
          html: customerOrderHtml(purchaseDto, purchaseItems),
        });

        return purchases;
      } catch (e) {
        throw new HttpException(
          { message: ERROR_MESSAGES.SERVER_ERROR, error: e },
          HttpStatus.BAD_REQUEST,
        );
      }
    });
  }

  public handleFindById(id: string, userId: string): Promise<Purchase> {
    return this.purchaseRepository
      .createQueryBuilder('purchase')
      .leftJoinAndSelect('purchase.purchaseItems', 'purchase_item')
      .leftJoinAndSelect('purchase_item.product', 'product')
      .where('purchase.id = :id AND purchase.user_id', { id, userId })
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
    userId: string,
    purchaseDto: UpdatePurchaseDto,
  ): Promise<Purchase> {
    return this.connection.transaction(async (manager) => {
      try {
        const purchaseRepositoryTransaction = manager.getRepository<Purchase>(
          Purchase,
        );

        this.updatePurchaseItemsArray(purchaseDto.purchaseItem);

        const purchase = await purchaseRepositoryTransaction.findOne({
          where: { id, user: userId },
        });

        const updatedPurchase = await purchaseRepositoryTransaction.save({
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

  public handleDelete(id: number, userId: string): Promise<DeleteResult> {
    return this.purchaseRepository.delete({ id, user: { id: userId } });
  }

  private updatePurchaseItem = async (
    itemDto: UpdatePurchaseItemDto,
  ): Promise<UpdatePurchaseItemDto> => {
    const purchaseItem = await this.purchaseItemRepository.findOneOrFail(
      itemDto.id,
    );
    return this.purchaseItemRepository.save({ ...purchaseItem, ...itemDto });
  };

  private updatePurchaseItemsArray = (
    itemsDto: UpdatePurchaseItemDto[],
  ): Promise<UpdatePurchaseItemDto[]> => {
    return Promise.all(
      itemsDto.map((item: UpdatePurchaseItemDto) =>
        this.updatePurchaseItem(item),
      ),
    );
  };

  private sendMail = async (purchase: Purchase) => {
    const purchaseItems = await this.purchaseItemRepository
      .createQueryBuilder('purchase_item')
      .leftJoinAndSelect('purchase_item.product', 'product')
      .where('purchase_item.purchase_id = :purchaseId', {
        purchaseId: purchase.id,
      })
      .getMany();

    this.mailerService.sendMail({
      to: purchase.user.email,
      subject: EMAIL_MESSAGES.sellerOrderSubject,
      text: EMAIL_MESSAGES.sellerOrderText,
      html: sellerOrderHtml(purchase, purchaseItems),
    });
  };

  private sendMailsForSellers = (purchases: Purchase[]): Promise<void[]> => {
    return Promise.all(purchases.map((item) => this.sendMail(item)));
  };

  private savePurchase = async (
    purchaseItemDto: CreatePurchaseItemDto,
    purchaseDto: CreatePurchaseDto,
  ): Promise<Purchase> => {
    const user = await this.userRepository.findOneOrFail(
      purchaseItemDto.userId,
    );
    const purchase = await this.purchaseRepository.save({
      ...purchaseDto,
      user,
    });

    await this.saveArrayPurchaseItems(purchaseItemDto.products, purchase);

    return purchase;
  };

  private saveArrayPurchases = async (
    purchaseDto: CreatePurchaseDto,
  ): Promise<Purchase[]> => {
    return Promise.all(
      purchaseDto.purchaseItem.map((item) =>
        this.savePurchase(item, purchaseDto),
      ),
    );
  };

  private saveArrayPurchaseItems = async (
    productsPurchase: ProductPurchaseDto[],
    purchase: Purchase,
  ): Promise<PurchaseItem[]> => {
    return Promise.all(
      productsPurchase.map((productPurchase) =>
        this.savePurchaseItem(productPurchase, purchase),
      ),
    );
  };

  private savePurchaseItem = async (
    productPurchase: ProductPurchaseDto,
    purchase: Purchase,
  ): Promise<PurchaseItem> => {
    const product = await this.productRepository.findOneOrFail(
      productPurchase.productId,
    );

    return this.purchaseItemRepository.save({
      product,
      purchase,
      ...productPurchase,
    });
  };
}
