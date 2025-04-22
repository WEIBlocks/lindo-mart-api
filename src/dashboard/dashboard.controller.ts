import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FormsService } from '../forms/forms.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomRequest } from '../types/custom-request.interface';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly formsService: FormsService) {}

  @Get('forms')
  // TODO: Add Super-Admin Guard
  async getAllForms() {
    return this.formsService.getAllForms();
  }

  @Get('user-forms')
  async getUserRelatedForms(@Request() req: CustomRequest) {
    return this.formsService.getUserRelatedForms(req.user.userId);
  }

  @Post('move-form')
  async moveForm(
    @Request() req: CustomRequest,
    @Body('formId') formId: string,
    @Body('newRecipient') newRecipient: string,
    @Body('newStatus') newStatus: string
  ) {
    return this.formsService.moveForm(
      req.user.userId,
      formId,
      newRecipient,
      newStatus
    );
  }
}
