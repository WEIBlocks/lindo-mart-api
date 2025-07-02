import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class ResendService {
  private resend: Resend;
  private readonly logger = new Logger(ResendService.name);

  constructor(private configService: ConfigService) {
    const apiKey =
      this.configService.get<string>('RESEND_API_KEY') ||
      process.env.RESEND_API_KEY || "re_BnT4Ug6C_9NJ6tHmhh3V1fnypZ4rh81yS";
    this.resend = new Resend(apiKey);
  }

  async sendFormReceivedEmail(to: string, formDetails: any): Promise<void> {
    try { 
      const { data, error } = await this.resend.emails.send({
        from:
          process.env.RESEND_SENDER_EMAIL ||
          'Lindo Mart <noreply@lindomart.com>',
        to: [to],
        subject: '📋 New Form Received - Action Required',
        html: this.generateFormReceivedTemplate(formDetails),
      });

      if (error) {
        this.logger.error('Error sending form received email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
      }

      this.logger.log(`Form received email sent successfully to ${to}`);
    } catch (error) {
      this.logger.error('Error sending form received email:', error);
      throw error;
    }
  }

  async sendFormStatusUpdateEmail(
    to: string,
    formDetails: any,
    newStatus: string
  ): Promise<void> {
    try {
      const { data, error } = await this.resend.emails.send({
        from:
          process.env.RESEND_SENDER_EMAIL ||
          'Lindo Mart <noreply@lindomart.com>',
        to: [to],
        subject: `🔄 Form Status Updated - ${newStatus}`,
        html: this.generateStatusUpdateTemplate(formDetails, newStatus),
      });

      if (error) {
        this.logger.error('Error sending status update email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
      }

      this.logger.log(`Status update email sent successfully to ${to}`);
    } catch (error) {
      this.logger.error('Error sending status update email:', error);
      throw error;
    }
  }

  async sendRoleUpdateEmail(
    to: string,
    username: string,
    newRole: string
  ): Promise<void> {
    try {
      const { data, error } = await this.resend.emails.send({
        from:
          process.env.RESEND_SENDER_EMAIL ||
          'Lindo Mart <noreply@lindomart.com>',
        to: [to],
        subject: '👤 Your Role Has Been Updated',
        html: this.generateRoleUpdateTemplate(username, newRole),
      });

      if (error) {
        this.logger.error('Error sending role update email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
      }

      this.logger.log(`Role update email sent successfully to ${to}`);
    } catch (error) {
      this.logger.error('Error sending role update email:', error);
      throw error;
    }
  }

  async sendFormMovedEmail(
    to: string,
    formDetails: any,
    movedBy: string
  ): Promise<void> {
    try {
      const { data, error } = await this.resend.emails.send({
        from:
          process.env.RESEND_SENDER_EMAIL ||
          'Lindo Mart <noreply@lindomart.com>',
        to: [to],
        subject: '↗️ Form Transferred to You',
        html: this.generateFormMovedTemplate(formDetails, movedBy),
      });

      if (error) {
        this.logger.error('Error sending form moved email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
      }

      this.logger.log(`Form moved email sent successfully to ${to}`);
    } catch (error) {
      this.logger.error('Error sending form moved email:', error);
      throw error;
    }
  }

  async sendFollowUpEmail(to: string, formDetails: any): Promise<void> {
    try {
      const { data, error } = await this.resend.emails.send({
        from:
          process.env.RESEND_SENDER_EMAIL ||
          'Lindo Mart <noreply@lindomart.com>',
        to: [to],
        subject: '⏰ Follow-up Required - Form Pending',
        html: this.generateFollowUpTemplate(formDetails),
      });

      if (error) {
        this.logger.error('Error sending follow-up email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
      }

      this.logger.log(`Follow-up email sent successfully to ${to}`);
    } catch (error) {
      this.logger.error('Error sending follow-up email:', error);
      throw error;
    }
  }

  // Generic email method for custom messages
  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      const { data, error } = await this.resend.emails.send({
        from:
          process.env.RESEND_SENDER_EMAIL ||
          'Lindo Mart <noreply@lindomart.com>',
        to: [to],
        subject,
        html,
      });

      if (error) {
        this.logger.error('Error sending email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
      }

      this.logger.log(`Email sent successfully to ${to}`);
    } catch (error) {
      this.logger.error('Error sending email:', error);
      throw error;
    }
  }

  private generateFormReceivedTemplate(formDetails: any): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px;">📋 New Form Received</h1>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Action required on your part</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">Form Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500; width: 120px;">Form ID:</td>
                <td style="padding: 8px 0; color: #374151; font-weight: 600;">${formDetails.formId || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Form Type:</td>
                <td style="padding: 8px 0; color: #374151; font-weight: 600;">${formDetails.formType || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Status:</td>
                <td style="padding: 8px 0;">
                  <span style="background-color: #fbbf24; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: uppercase; font-weight: 600;">
                    ${formDetails.status || 'Pending'}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Submitted:</td>
                <td style="padding: 8px 0; color: #374151;">${formDetails.createdAt ? new Date(formDetails.createdAt).toLocaleDateString() : 'N/A'}</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/received-forms/${formDetails.formId}" 
               style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; transition: background-color 0.3s;">
              View Form Details
            </a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0; text-align: center;">
              This is an automated notification from Lindo Mart Form Management System.<br>
              Please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  private generateStatusUpdateTemplate(
    formDetails: any,
    newStatus: string
  ): string {
    const statusColor = this.getStatusColor(newStatus);

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px;">🔄 Form Status Updated</h1>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Your form status has been changed</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">Status Update:</h3>
            <div style="text-align: center; margin: 20px 0;">
              <span style="background-color: ${statusColor}; color: white; padding: 8px 20px; border-radius: 25px; font-size: 16px; text-transform: uppercase; font-weight: 600;">
                ${newStatus}
              </span>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500; width: 120px;">Form ID:</td>
                <td style="padding: 8px 0; color: #374151; font-weight: 600;">${formDetails.formId || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Form Type:</td>
                <td style="padding: 8px 0; color: #374151; font-weight: 600;">${formDetails.formType || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Updated:</td>
                <td style="padding: 8px 0; color: #374151;">${new Date().toLocaleDateString()}</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/forms/${formDetails.formId}" 
               style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              View Form
            </a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0; text-align: center;">
              This is an automated notification from Lindo Mart Form Management System.<br>
              Please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  private generateRoleUpdateTemplate(
    username: string,
    newRole: string
  ): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px;">👤 Role Updated</h1>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Your system role has been changed</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">Hello ${username},</h3>
            <p style="color: #6b7280; margin: 0 0 15px 0; line-height: 1.6;">
              Your role in the Lindo Mart Form Management System has been updated by an administrator.
            </p>
            
            <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p style="color: #1e40af; margin: 0; font-size: 14px; font-weight: 500;">NEW ROLE</p>
              <p style="color: #1e40af; margin: 5px 0 0 0; font-size: 20px; font-weight: 700; text-transform: uppercase;">
                ${newRole}
              </p>
            </div>
            
            <p style="color: #6b7280; margin: 15px 0 0 0; line-height: 1.6; font-size: 14px;">
              This role change may affect your permissions and access levels within the system. 
              Please contact your administrator if you have any questions about your new role.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" 
               style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              Access Dashboard
            </a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0; text-align: center;">
              This is an automated notification from Lindo Mart Form Management System.<br>
              Please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  private generateFormMovedTemplate(formDetails: any, movedBy: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px;">↗️ Form Transferred</h1>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">A form has been transferred to you</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">Transfer Details:</h3>
            <p style="color: #6b7280; margin: 0 0 15px 0; line-height: 1.6;">
              This form has been transferred to you by <strong>${movedBy}</strong> and requires your attention.
            </p>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500; width: 120px;">Form ID:</td>
                <td style="padding: 8px 0; color: #374151; font-weight: 600;">${formDetails.formId || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Form Type:</td>
                <td style="padding: 8px 0; color: #374151; font-weight: 600;">${formDetails.formType || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Status:</td>
                <td style="padding: 8px 0;">
                  <span style="background-color: #fbbf24; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: uppercase; font-weight: 600;">
                    ${formDetails.status || 'Pending'}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Transferred By:</td>
                <td style="padding: 8px 0; color: #374151; font-weight: 600;">${movedBy}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Transferred:</td>
                <td style="padding: 8px 0; color: #374151;">${new Date().toLocaleDateString()}</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/received-forms/${formDetails.formId}" 
               style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              Review Form
            </a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0; text-align: center;">
              This is an automated notification from Lindo Mart Form Management System.<br>
              Please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  private generateFollowUpTemplate(formDetails: any): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #dc2626; margin: 0; font-size: 28px;">⏰ Follow-up Required</h1>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Form pending attention</p>
          </div>
          
          <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 25px;">
            <h3 style="color: #991b1b; margin: 0 0 15px 0; font-size: 18px;">Action Required:</h3>
            <p style="color: #7f1d1d; margin: 0 0 15px 0; line-height: 1.6;">
              This form has been pending for some time and requires your immediate attention. 
              Please review and take appropriate action.
            </p>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #7f1d1d; font-weight: 500; width: 120px;">Form ID:</td>
                <td style="padding: 8px 0; color: #991b1b; font-weight: 600;">${formDetails.formId || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #7f1d1d; font-weight: 500;">Form Type:</td>
                <td style="padding: 8px 0; color: #991b1b; font-weight: 600;">${formDetails.formType || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #7f1d1d; font-weight: 500;">Status:</td>
                <td style="padding: 8px 0;">
                  <span style="background-color: #dc2626; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: uppercase; font-weight: 600;">
                    ${formDetails.status || 'Pending'}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #7f1d1d; font-weight: 500;">Pending Since:</td>
                <td style="padding: 8px 0; color: #991b1b;">${formDetails.createdAt ? new Date(formDetails.createdAt).toLocaleDateString() : 'N/A'}</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/received-forms/${formDetails.formId}" 
               style="background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              Take Action Now
            </a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0; text-align: center;">
              This is an automated follow-up from Lindo Mart Form Management System.<br>
              Please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  private getStatusColor(status: string): string {
    const statusColors = {
      Pending: '#fbbf24',
      'In Progress': '#3b82f6',
      Approved: '#10b981',
      Rejected: '#ef4444',
      Completed: '#059669',
      'On Hold': '#f59e0b',
    };
    return statusColors[status] || '#6b7280';
  }
}
