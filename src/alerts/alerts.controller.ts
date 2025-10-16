import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomRequest } from '../types/custom-request.interface';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('/alerts')
@UseGuards(JwtAuthGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super-Admin')
  async getAllAlerts() {
    return this.alertsService.getAllAlerts();
  }

  @Get('user')
  async getUserAlerts(@Request() req: CustomRequest) {
    return this.alertsService.getUserAlerts(req.user.userId);
  }

  @Patch('user/:id/status')
  async updateAlertStatus(
    @Request() req: CustomRequest,
    @Param('id') alertId: string,
    @Body('status') status: string
  ) {
    return this.alertsService.updateAlertStatus(
      req.user.userId,
      alertId,
      status
    );
  }
}
