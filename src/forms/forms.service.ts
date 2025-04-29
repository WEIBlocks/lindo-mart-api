import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Form } from '../schemas/form/form.schema';
import { AlertsService } from '../alerts/alerts.service';
import { User } from '../schemas/user/user.schema';
import { log } from 'console';

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(Form.name) private formModel: Model<Form>,
    @InjectModel(User.name) private userModel: Model<User>,
    private alertsService: AlertsService
  ) {}

  async submitForm(userId: string, formData: any, recipient: string) {
    const newForm = new this.formModel({
      ...formData,
      userId,
      recipient,
      status: 'Pending',
      history: [{
        status: 'Pending',
        timestamp: new Date(),
        userId,
        fromUserId: userId,
        toUserId: recipient,
      }]
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

  async updateFormStatus(user: any, formId: string, newStatus: string) {
    const userId = user.userId;
    // Find form where recipient is either the user's ID or their role
    const form = await this.formModel.findOne({
      _id: formId,
      $or: [{ recipient: userId }, { recipient: user.role }]
    }).exec();
    
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
    // First, get the user to check their role
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find forms where:
    // 1. The user is directly specified as the recipient
    // 2. The user's role is specified as the recipient
    return this.formModel
      .find({
        $or: [{ recipient: userId }, { recipient: user.role }],
      })
      .exec();
  }

  async moveForm(
    userId: string,
    formId: string,
    newRecipient: string
  ) {
    const form = await this.formModel.findById(formId).exec();
    if (!form) {
      throw new NotFoundException('Form not found');
    }

    // Update form status and recipient
    form.recipient = newRecipient;
    form.history.push({
      status: form.status,
      timestamp: new Date(),
      userId,
      fromUserId: userId,
      toUserId: newRecipient,
    });
    await form.save();

    // Update user's movedForms
    const user = await this.userModel.findById(userId).exec();
    if (user) {
      user.movedForms.push({
        formId,
        recipientId: newRecipient,
        status: form.status,
      });
      await user.save();
    }

    // Generate alert for the new recipient
    await this.alertsService.sendAlert(
      `Form moved to you with status: ${form.status}`,
      newRecipient,
      formId,
      userId
    );

    return { message: 'Form moved successfully' };
  }

  async getMovedForms(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const movedForms = user.movedForms;
    const populatedForms = await Promise.all(
      movedForms.map(async (movedForm) => {
        const form = await this.formModel.findById(movedForm.formId).exec();
        return {
          formId: movedForm.formId,
          formData: form ? {
            status: form.status,
            _id: form._id,
            userId: form.userId,
            formType: form.formType,
            formData: form.formData,
            recipient: form.recipient,
            createdAt: form.createdAt,
            history: form.history,
            alertId: form.alertId
          } : null
        };
      })
    );

    return populatedForms;
  }
}
