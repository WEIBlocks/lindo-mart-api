import { Injectable } from '@nestjs/common';
import { FormsService } from '../forms/forms.service';

@Injectable()
export class DashboardService {
  constructor(private readonly formsService: FormsService) {}

  async getAllForms() {
    return this.formsService.getAllForms();
  }

  async getUserRelatedForms(userId: string) {
    return this.formsService.getUserRelatedForms(userId);
  }

  async moveForm(
    userId: string,
    formId: string,
    newRecipient: string,
    newStatus: string
  ) {
    return this.formsService.moveForm(userId, formId, newRecipient, newStatus);
  }
}
