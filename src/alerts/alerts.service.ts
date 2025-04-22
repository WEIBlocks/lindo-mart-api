import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Alert } from '../schemas/alert/alert.schema';
import { User } from '../schemas/user/user.schema';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TwilioService } from '../common/twilio.service';
import { SendGridService } from '../common/sendgrid.service';
import { Form } from '../schemas/form/form.schema';

@Injectable()
@WebSocketGateway()
export class AlertsService {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectModel(Alert.name) private alertModel: Model<Alert>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Form.name) private formModel: Model<Form>,
    private twilioService: TwilioService,
    private sendGridService: SendGridService
  ) {}

  async sendAlert(
    message: string,
    role: string,
    relatedId: string,
    userId?: string
  ): Promise<string> {
    const users = userId
      ? await this.userModel.find({ _id: userId }).exec()
      : await this.userModel.find({ role }).exec();

    for (const user of users) {
      const categories = ['in-app'];

      // WebSocket
      this.server.to(user._id.toString()).emit('alert', message);

      // SMS
      if (user.phoneNumber) {
        await this.twilioService.sendSMS(user.phoneNumber, message);
        categories.push('sms');
      }

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

      return alert._id.toString();
    }
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
    }

    return { message: 'Status updated successfully' };
  }
}
