import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Alert } from '../schemas/alert/alert.schema';
import { User } from '../schemas/user/user.schema';
import { Form } from '../schemas/form/form.schema';
import { TwilioService } from '../common/twilio.service';
import { SendGridService } from '../common/sendgrid.service';
import { AlertsGateway } from './alerts.gateway';

@Injectable()
export class AlertsService {
  constructor(
    @InjectModel(Alert.name) private alertModel: Model<Alert>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Form.name) private formModel: Model<Form>,
    private twilioService: TwilioService,
    private sendGridService: SendGridService,
    private alertsGateway: AlertsGateway
  ) {}

  async sendAlert(
    message: string,
    role: string,
    relatedId: string,
    userId?: string
  ): Promise<string> {
    
    const validRoles = ['Staff', 'Supervisor', 'Management', 'Super-Admin'];
    const users = validRoles.includes(role)
      ? await this.userModel.find({ role }).exec()
      : await this.userModel.find({ _id: role }).exec();

    let lastAlertId: string;

    for (const user of users) {
      const categories = ['in-app'];

      // Send WebSocket notification
      if (user._id) {
        await this.alertsGateway.sendNotificationToUser(
          user._id.toString(),
          message
        );
      } 
      // else {
      //   await this.alertsGateway.sendNotificationByRole(role, message);
      // }

      // SMS
      // if (user.phoneNumber) {
      //   await this.twilioService.sendSMS(user.phoneNumber, message);
      //   categories.push('sms');
      // }

      // Email
      // if (user.email) {
      //   await this.sendGridService.sendEmail(
      //     user.email,
      //     '🔔 New Alert Notification',
      //     `<p>${message}</p>`
      //   );
      //   categories.push('email');
      // }

      // Store alert with categories
      const alert = await this.alertModel.create({
        message,
        role,
        userId: user._id,
        categories,
        relatedId: relatedId,
      });

      lastAlertId = alert._id.toString();
    }

    return lastAlertId;
  }

  async getAllAlerts() {
    return this.alertModel.find().exec();
  }

  async getUserAlerts(userId: string) {
    return this.alertModel.find({ userId }).exec();
  }

  async updateAlertStatus(userId: string, alertId: string, status: string) {
    const alert = await this.alertModel
      .findOne({ _id: alertId, userId })
      .exec();
    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    // Ensure relatedId is accessed correctly
    const relatedId = alert.relatedId;

    // Update the status of the related form or event
    const form = await this.formModel
      .findByIdAndUpdate(relatedId, { status }, { new: true })
      .exec();

    if (form) {
      form.history.push({
        status,
        timestamp: new Date(),
        userId,
        fromUserId: null,
        toUserId: null,
      });
      await form.save();

      // Send notification about status update
      await this.sendAlert(
        `Form ${form._id} status updated to ${status}`,
        'Staff',
        form._id.toString(),
        form.userId
      );
    }

    return { message: 'Status updated successfully' };
  }
}


