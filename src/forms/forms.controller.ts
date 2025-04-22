import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Request,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { FormsService } from './forms.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomRequest } from '../types/custom-request.interface';

@Controller('forms')
@UseGuards(JwtAuthGuard)
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post('submit')
  async submitForm(@Request() req: CustomRequest, @Body() formData: any) {
    return this.formsService.submitForm(
      req.user.userId,
      formData,
      formData.recipient
    );
  }

  @Get('user-forms')
  async getUserForms(@Request() req: CustomRequest) {
    return this.formsService.getUserForms(req.user.userId);
  }

  @Get('user-form/:id')
  async getFormStatus(
    @Request() req: CustomRequest,
    @Param('id') formId: string
  ) {
    return this.formsService.getFormStatus(req.user.userId, formId);
  }

  @Patch(':formId/status')
  async updateFormStatus(
    @Request() req: CustomRequest,
    @Param('formId') formId: string,
    @Body('status') newStatus: string
  ) {
    return this.formsService.updateFormStatus(
      req.user.userId,
      formId,
      newStatus
    );
  }
}
