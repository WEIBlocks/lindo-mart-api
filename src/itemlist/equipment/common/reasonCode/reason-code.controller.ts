import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ReasonCodeService } from './reason-code.service';
import { CreateReasonCodeDto } from './dto/create-reason-code.dto';
import { UpdateReasonCodeDto } from './dto/update-reason-code.dto';
import { JwtAuthGuard } from '../../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';

@Controller('itemlist/equipment/reason-codes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Super-Admin', 'Admin')
export class ReasonCodeController {
  constructor(private readonly reasonCodeService: ReasonCodeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createReasonCodeDto: CreateReasonCodeDto) {
    return this.reasonCodeService.create(createReasonCodeDto).then(() => ({
      success: true,
      message: 'Reason code created successfully'
    }));
  }

  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10
  ) {
    return this.reasonCodeService.findAll(page, limit).then(result => ({
      success: true,
      message: 'Reason codes retrieved successfully',
      data: result
    }));
  }

  @Get('public')
  @UseGuards(JwtAuthGuard) // Only authentication, no role guard
  getPublicReasonCodes() {
    return this.reasonCodeService.getPublicReasonCodes().then(reasonCodes => ({
      success: true,
      message: 'Reason codes retrieved successfully',
      data: reasonCodes
    }));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reasonCodeService.findOne(id).then(reasonCode => ({
      success: true,
      message: 'Reason code retrieved successfully',
      data: reasonCode
    }));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReasonCodeDto: UpdateReasonCodeDto) {
    return this.reasonCodeService.update(id, updateReasonCodeDto).then(() => ({
      success: true,
      message: 'Reason code updated successfully'
    }));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reasonCodeService.remove(id).then(() => ({
      success: true,
      message: 'Reason code deleted successfully'
    }));
  }
}
