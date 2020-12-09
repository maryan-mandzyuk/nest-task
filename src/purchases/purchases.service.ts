import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  customerOrderHtml,
  EMAIL_MESSAGES,
  ERROR_MESSAGES,
} from 'src/constants';
import { Product } from 'src/products/product.entity';
import { Users } from 'src/users/user.entity';
import { Connection, DeleteResult, Repository } from 'typeorm';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { CreatePurchaseItemDto } from './dto/create-purchaseItem.dto';
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

  public async handleCreate(purchaseDto: CreatePurchaseDto): Promise<Purchase> {
    return this.connection.transaction(async (manager) => {
      try {
        const purchaseTransaction = manager.getRepository<Purchase>(Purchase);
        const purchaseItemTransaction = manager.getRepository<PurchaseItem>(
          PurchaseItem,
        );

        const purchase: Purchase = await purchaseTransaction.save({
          ...purchaseDto,
        });

        const purchaseItems = await this.savePurchaseItemsArray(
          purchaseDto.purchaseItems,
          purchase,
          purchaseItemTransaction,
        );

        await this.mailerService.sendMail({
          to: purchaseDto.email,
          subject: EMAIL_MESSAGES.customerOrderSubject,
          text: EMAIL_MESSAGES.customerOrderText,
          html: customerOrderHtml(purchaseDto, purchaseItems),
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
      .where('product.user_id = :id', { id })
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

        this.updatePurchaseItemsArray(purchaseDto.purchaseItem);

        const purchase = await purchaseRepositoryTransaction.findOneOrFail(id);

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

  public handleDelete(id: number): Promise<DeleteResult> {
    return this.purchaseRepository.delete({ id });
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

  private savePurchaseItem = async (
    item: CreatePurchaseItemDto,
    purchase: Purchase,
    purchaseItemTransaction: Repository<PurchaseItem>,
  ): Promise<PurchaseItem> => {
    const product = await this.productRepository.findOneOrFail(item.productId);
    return purchaseItemTransaction.save({
      ...item,
      purchase,
      product,
    });
  };

  private savePurchaseItemsArray = (
    items: CreatePurchaseItemDto[],
    purchase: Purchase,
    purchaseItemTransaction: Repository<PurchaseItem>,
  ): Promise<PurchaseItem[]> => {
    return Promise.all(
      items.map((item) =>
        this.savePurchaseItem(item, purchase, purchaseItemTransaction),
      ),
    );
  };
}
