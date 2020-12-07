import {
  Controller,
  Get,
  UseGuards,
  Request,
  Query,
  Post,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ID_PARAM } from 'src/constants';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { Purchase } from './entities/purchase.entity';
import { PurchasesService } from './purchases.service';

@ApiTags('purchases')
@Controller('purchases')
export class PurchasesController {
  constructor(private purchasesService: PurchasesService) {}

  @Get('/seller/:id')
  @ApiParam(ID_PARAM)
  findPurchasesBySeller(@Param() params) {
    return this.purchasesService.handleFindBySeller(params.id);
  }

  @Get('/:id/')
  @ApiParam(ID_PARAM)
  findPurchaseById(@Param() params): Promise<Purchase> {
    return this.purchasesService.handleFindById(params.id);
  }

  @Post('/')
  @ApiBody({ type: CreatePurchaseDto })
  createPurchase(
    @Body() createPurchaseDto: CreatePurchaseDto,
  ): Promise<Purchase> {
    return this.purchasesService.handleCreate(createPurchaseDto);
  }

  @Put('/:id')
  @ApiParam(ID_PARAM)
  updatePurchase(
    @Param() params,
    @Body() purchaseDto: UpdatePurchaseDto,
  ): Promise<Purchase> {
    return this.purchasesService.handleUpdate(params.id, purchaseDto);
  }
}
