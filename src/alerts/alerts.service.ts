import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Alert } from '../schemas/alert/alert.schema';
import { User } from '../schemas/user/user.schema';
import { Form } from '../schemas/form/form.schema';
import { GmailService } from '../common/gmail.service';
import { TwilioService } from '../common/twilio.service';
import { AlertsGateway } from './alerts.gateway';

@Injectable()
export class AlertsService {
  constructor(
    @InjectModel(Alert.name) private alertModel: Model<Alert>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Form.name) private formModel: Model<Form>,
    private gmailService: GmailService,
    private twilioService: TwilioService,
    private alertsGateway: AlertsGateway
  ) {}

  async sendAlert(
    message: string,
    relatedId: string,
    userId?: string, // who is changing the status
    role?: string, // it can be single user id or role
    userIds?: string[] // it can be array of user ids
  ): Promise<string> {
    const validRoles = ['Staff', 'Supervisor', 'Management', 'Super-Admin'];
    let users;

    // Check if userIds are provided, if so, fetch users by IDs
    if (userIds && userIds.length > 0) {
      users = await this.userModel.find({ _id: { $in: userIds } }).exec();
    } else {
      users = validRoles.includes(role)
        ? await this.userModel.find({ role }).exec()
        : await this.userModel.find({ _id: role }).exec();
    }

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

      console.log('user.email', user.email);

      // SMS notification using Twilio (uncomment when needed)
      // if (user.phoneNumber && this.twilioService.isValidPhoneNumber(user.phoneNumber)) {
      //   try {
      //     const formattedPhone = this.twilioService.formatPhoneNumber(user.phoneNumber);
      //     await this.twilioService.sendSMS(formattedPhone, message);
      //     categories.push('sms');
      //     console.log(`SMS sent successfully to ${user.phoneNumber}`);
      //   } catch (smsError) {
      //     console.error('Failed to send SMS notification:', smsError);
      //     // Continue execution even if SMS fails
      //   }
      // }

      // Email notification using Resend
      if (user.email) {
        try {
          // Get form details for better email context
          let formDetails = null;
          try {
            formDetails = await this.formModel.findById(relatedId).exec();
          } catch (error) {
            // If form not found, create basic details
            formDetails = {
              _id: relatedId,
              formId: relatedId,
              formType: 'General',
              status: 'Pending',
              createdAt: new Date(),
            };
          }

          // Determine email type based on message content
          if (message.toLowerCase().includes('new form received')) {
            await this.gmailService.sendFormReceivedEmail(user.email, {
              formId: formDetails?._id || relatedId,
              formType: formDetails?.formType || 'General',
              status: formDetails?.status || 'Pending',
              createdAt: formDetails?.createdAt || new Date(),
            });
          } else if (message.toLowerCase().includes('status updated')) {
            const statusMatch = message.match(/status updated to (\w+)/i);
            const newStatus = statusMatch ? statusMatch[1] : 'Updated';
            await this.gmailService.sendFormStatusUpdateEmail(
              user.email,
              {
                formId: formDetails?._id || relatedId,
                formType: formDetails?.formType || 'General',
                status: formDetails?.status || 'Pending',
                createdAt: formDetails?.createdAt || new Date(),
              },
              newStatus
            );
          } else if (
            message.toLowerCase().includes('form moved') ||
            message.toLowerCase().includes('form transferred')
          ) {
            await this.gmailService.sendFormMovedEmail(
              user.email,
              {
                formId: formDetails?._id || relatedId,
                formType: formDetails?.formType || 'General',
                status: formDetails?.status || 'Pending',
                createdAt: formDetails?.createdAt || new Date(),
              },
              'System Administrator'
            );
          } else if (message.toLowerCase().includes('follow-up')) {
            await this.gmailService.sendFollowUpEmail(user.email, {
              formId: formDetails?._id || relatedId,
              formType: formDetails?.formType || 'General',
              status: formDetails?.status || 'Pending',
              createdAt: formDetails?.createdAt || new Date(),
            });
          } else if (
            message.toLowerCase().includes('role') &&
            message.toLowerCase().includes('updated')
          ) {
            const roleMatch = message.match(/role has been updated to (\w+)/i);
            const newRole = roleMatch ? roleMatch[1] : 'Staff';
            await this.gmailService.sendRoleUpdateEmail(
              user.email,
              user.username,
              newRole
            );
          } else {
            // Generic email for other types of notifications
            await this.gmailService.sendEmail(
              user.email,
              '🔔 New Alert Notification',
              `<p style="font-family: Arial, sans-serif; color: #374151; line-height: 1.6;">${message}</p>`
            );
          }

          categories.push('email');
        } catch (emailError) {
          console.error('Failed to send email notification:', emailError);
          // Continue execution even if email fails
        }
      }

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
