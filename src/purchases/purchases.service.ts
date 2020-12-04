import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { Purchase } from './entities/purchase.entity';
import { PurchaseItem } from './entities/purchaseItem.entity';
@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    @InjectRepository(PurchaseItem)
    private readonly purchaseItemRepository: Repository<PurchaseItem>,
  ) {}

  async handleCreate(purchaseDto: CreatePurchaseDto): Promise<Purchase> {
    const purchase = await this.purchaseRepository.save({ ...purchaseDto });
    // TODO
    purchaseDto.purchaseItem.forEach(async (item) => {
      await this.purchaseItemRepository.save({
        purchase,
      });
    });

    return purchase;
  }
}
