import {
  Controller,
  Get,
  UseGuards,
  Body,
  Param,
  Put,
  Delete,
  Post,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthHelper } from 'src/auth/authHelper';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ID_PARAM, TOKEN_KEY, TOKEN_TYPES } from 'src/constants';
import { DeleteResult } from 'typeorm';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { Purchase } from './entities/purchase.entity';
import { PurchasesService } from './purchases.service';

@ApiTags('purchases')
@Controller('purchases')
export class PurchasesController {
  constructor(private purchasesService: PurchasesService) {}

  @Get('/seller/me')
  @UseGuards(new AuthGuard(TOKEN_TYPES.ACCESS))
  @ApiBearerAuth()
  @ApiResponse({
    type: [Purchase],
    status: 200,
  })
  findPurchasesBySeller(@Request() req): Promise<Purchase[]> {
    const token = AuthHelper.getTokenFromRequest(req, TOKEN_KEY.ACCESS);
    const { userId } = AuthHelper.decodeTokenPayload(token);
    return this.purchasesService.handleFindBySeller(userId);
  }

  @Get('/:id/')
  @ApiParam(ID_PARAM)
  @ApiResponse({
    type: Purchase,
    status: 200,
  })
  findPurchaseById(@Param() params): Promise<Purchase> {
    return this.purchasesService.handleFindById(params.id);
  }

  @Post('/')
  @ApiBody({ type: CreatePurchaseDto })
  @ApiResponse({
    type: Purchase,
    status: 201,
  })
  createPurchase(
    @Body() createPurchaseDto: CreatePurchaseDto,
  ): Promise<Purchase[]> {
    return this.purchasesService.handleCreate(createPurchaseDto);
  }

  @Put('/:id')
  @ApiParam(ID_PARAM)
  @ApiResponse({
    type: Purchase,
    status: 200,
  })
  updatePurchase(
    @Param() params,
    @Body() purchaseDto: UpdatePurchaseDto,
  ): Promise<Purchase> {
    return this.purchasesService.handleUpdate(params.id, purchaseDto);
  }

  @Delete('/:id')
  @ApiParam(ID_PARAM)
  @ApiResponse({
    type: DeleteResult,
    status: 200,
  })
  deletePurchase(@Param() params): Promise<DeleteResult> {
    return this.purchasesService.handleDelete(params.id);
  }
}
