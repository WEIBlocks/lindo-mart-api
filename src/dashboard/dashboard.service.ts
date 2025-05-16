import { Injectable, NotFoundException } from '@nestjs/common';
import { FormsService } from '../forms/forms.service';
import { AlertsService } from '../alerts/alerts.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user/user.schema';

@Injectable()
export class DashboardService {
  constructor(
    private readonly formsService: FormsService,
    private readonly alertsService: AlertsService,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

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
    signatureImage?: string
  ) {
    return this.formsService.moveForm(
      userId,
      formId,
      newRecipient,
      signatureImage
    );
  }

  async getMovedForms(userId: string) {
    return this.formsService.getMovedForms(userId);
  }

  async triggerFollowUp(userId: string, formId: string, recipientId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const form = user.movedForms.find(
      (f) => f.formId === formId && f.recipientId === recipientId
    );
    if (!form) {
      throw new NotFoundException('Form not found in user moved forms');
    }

    const message = `Follow-up required for form ${formId}`;
    await this.alertsService.sendAlert(
      message,
      formId,
      userId,
      recipientId,
      null
    );

    return { message: 'Follow-up alert sent successfully' };
  }
}
