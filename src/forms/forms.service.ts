import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Form } from '../schemas/form/form.schema';
import { AlertsService } from '../alerts/alerts.service';

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(Form.name) private formModel: Model<Form>,
    private alertsService: AlertsService
  ) {}

  async submitForm(userId: string, formData: any, recipient: string) {
    const newForm = new this.formModel({
      ...formData,
      userId,
      recipient,
      status: 'Pending',
    });
    const savedForm = await newForm.save();

    // Generate alert for the recipient
    const alertId = await this.alertsService.sendAlert(
      'New Form Received',
      recipient,
      savedForm._id.toString(),
      userId
    );

    // Update form with alertId
    savedForm.alertId = alertId;
    await savedForm.save();

    return savedForm;
  }

  async getUserForms(userId: string) {
    return this.formModel.find({ userId }).exec();
  }

  async getFormStatus(userId: string, formId: string) {
    const form = await this.formModel.findOne({ _id: formId, userId }).exec();
    if (!form) {
      throw new NotFoundException('Form not found');
    }
    return form;
  }

  async updateFormStatus(userId: string, formId: string, newStatus: string) {
    const form = await this.formModel.findOne({ _id: formId, userId }).exec();
    if (!form) {
      throw new NotFoundException('Form not found');
    }

    // Update form status
    form.status = newStatus;
    form.history.push({
      status: newStatus,
      timestamp: new Date(),
      userId,
      fromUserId: null,
      toUserId: null,
    });
    await form.save();

    // Update alert status if alertId exists
    // if (form.alertId) {
    //   await this.alertsService.updateAlertStatus(
    //     userId,
    //     form.alertId,
    //     newStatus
    //   );
    // }

    return { message: 'Form status updated successfully' };
  }

  async getAllForms() {
    return this.formModel.find().exec();
  }

  async getUserRelatedForms(userId: string) {
    return this.formModel.find({ recipient: userId }).exec();
  }

  async moveForm(
    userId: string,
    formId: string,
    newRecipient: string,
    newStatus: string
  ) {
    const form = await this.formModel.findById(formId).exec();
    if (!form) {
      throw new NotFoundException('Form not found');
    }

    // Update form status and recipient
    form.status = newStatus;
    form.recipient = newRecipient;
    form.history.push({
      status: newStatus,
      timestamp: new Date(),
      userId,
      fromUserId: userId,
      toUserId: newRecipient,
    });
    await form.save();

    // Generate alert for the new recipient
    await this.alertsService.sendAlert(
      `Form moved to you with status: ${newStatus}`,
      newRecipient,
      formId,
      userId
    );

    return { message: 'Form moved successfully' };
  }
}
