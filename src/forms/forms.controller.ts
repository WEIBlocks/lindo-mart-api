import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Request,
  UseGuards,
  Patch,
  Query,
} from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsMetadataService } from './forms-metadata.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomRequest } from '../types/custom-request.interface';

@Controller('/forms')
@UseGuards(JwtAuthGuard)
export class FormsController {
  constructor(
    private readonly formsService: FormsService,
    private readonly formsMetadataService: FormsMetadataService,
  ) {}

  @Post('submit')
  async submitForm(@Request() req: CustomRequest, @Body() formData: any) {
    return this.formsService.submitForm(
      req.user.userId,
      formData,
      formData.recipient
    );
  }

  @Get('user-forms')
  async getUserForms(
    @Request() req: CustomRequest,
    @Query('formType') formType?: string,
  ) {
    return this.formsService.getUserForms(req.user.userId, formType);
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
    @Body('status') newStatus: string,
    @Body('signatureImage') signatureImage?: string
  ) {
    return this.formsService.updateFormStatus(
      req.user,
      formId,
      newStatus,
      signatureImage
    );
  }

  @Get('metadata')
  async getFormMetadata(@Query('itemListType') itemListType: string) {
    return this.formsMetadataService
      .getFormMetadata(itemListType)
      .then((result) => ({
        success: true,
        message: 'Form metadata retrieved successfully',
        data: result,
      }));
  }
}
