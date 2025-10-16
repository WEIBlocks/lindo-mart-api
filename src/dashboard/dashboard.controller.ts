import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomRequest } from '../types/custom-request.interface';
import { DashboardService } from './dashboard.service';

@Controller('/dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin-stats')
  // TODO: Add Super-Admin Guard
  async getAdminDashboardStats() {
    return this.dashboardService.getAdminDashboardStats();
  }

  @Get('forms')
  // TODO: Add Super-Admin Guard
  async getAllForms() {
    return this.dashboardService.getAllForms();
  }

  @Get('user-forms')
  async getUserRelatedForms(@Request() req: CustomRequest) {
    return this.dashboardService.getUserRelatedForms(req.user.userId);
  }

  @Post('move-form')
  async moveForm(
    @Request() req: CustomRequest,
    @Body('formId') formId: string,
    @Body('newRecipient') newRecipient: string,
    @Body('signatureImage') signatureImage?: string
  ) {
    return this.dashboardService.moveForm(
      req.user.userId,
      formId,
      newRecipient,
      signatureImage
    );
  }

  @Get('moved-forms')
  async getMovedForms(@Request() req: CustomRequest) {
    return this.dashboardService.getMovedForms(req.user.userId);
  }

  @Post('trigger-followup')
  async triggerFollowUp(
    @Request() req: CustomRequest,
    @Body('formId') formId: string,
    @Body('recipientId') recipientId: string
  ) {
    return this.dashboardService.triggerFollowUp(
      req.user.userId,
      formId,
      recipientId
    );
  }
}
