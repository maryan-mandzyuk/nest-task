import {
  Controller,
  Get,
  UseGuards,
  Request,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { Purchase } from './entities/purchase.entity';
import { PurchasesService } from './purchases.service';

@ApiTags('purchases')
@Controller('purchases')
export class PurchasesController {
  constructor(private purchasesService: PurchasesService) {}

  @Get('/seller/:id')
  findPurchasesBySeller() {
    return;
  }

  @Get('/')
  findAllPurchases() {
    return;
  }

  @Post('/')
  @ApiBody({ type: CreatePurchaseDto })
  createPurchase(
    @Body() createPurchaseDto: CreatePurchaseDto,
  ): Promise<Purchase> {
    return this.purchasesService.handleCreate(createPurchaseDto);
  }
}
