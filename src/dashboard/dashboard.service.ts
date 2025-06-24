import { Injectable, NotFoundException } from '@nestjs/common';
import { FormsService } from '../forms/forms.service';
import { AlertsService } from '../alerts/alerts.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user/user.schema';
import { Form } from '../schemas/form/form.schema';

@Injectable()
export class DashboardService {
  constructor(
    private readonly formsService: FormsService,
    private readonly alertsService: AlertsService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Form.name) private formModel: Model<Form>
  ) {}

  async getAdminDashboardStats() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 7);
    const last30Days = new Date(today);
    last30Days.setDate(today.getDate() - 30);

    // Get time-based statistics
    const todayStats = await this.getTimeBasedStats(today, now);
    const last7DaysStats = await this.getTimeBasedStats(last7Days, now);
    const last30DaysStats = await this.getTimeBasedStats(last30Days, now);

    // Get form categories with status counts
    const formCategories = await this.getFormCategoriesStats();

    // Get performance metrics
    const performanceMetrics = await this.getPerformanceMetrics();

    return {
      timeBasedStats: {
        today: {
          period: 'TODAY',
          totalForms: todayStats.total,
          pending: todayStats.pending,
          inProgress: todayStats.inProgress,
          completed: todayStats.completed,
          moved: todayStats.moved,
        },
        last7Days: {
          period: 'LAST 7 DAYS',
          totalForms: last7DaysStats.total,
          pending: last7DaysStats.pending,
          inProgress: last7DaysStats.inProgress,
          completed: last7DaysStats.completed,
          moved: last7DaysStats.moved,
        },
        last30Days: {
          period: 'LAST 30 DAYS',
          totalForms: last30DaysStats.total,
          pending: last30DaysStats.pending,
          inProgress: last30DaysStats.inProgress,
          completed: last30DaysStats.completed,
          moved: last30DaysStats.moved,
        },
      },
      formCategories,
      performanceMetrics,
    };
  }

  private async getTimeBasedStats(startDate: Date, endDate: Date) {
    const forms = await this.formModel
      .find({
        createdAt: { $gte: startDate, $lte: endDate },
      })
      .exec();

    const stats = {
      total: forms.length,
      pending: 0,
      inProgress: 0,
      completed: 0,
      moved: 0,
    };

    forms.forEach((form) => {
      switch (form.status.toLowerCase()) {
        case 'pending':
          stats.pending++;
          break;
        case 'in-progress':
        case 'in progress':
          stats.inProgress++;
          break;
        case 'completed':
          stats.completed++;
          break;
        case 'moved':
          stats.moved++;
          break;
      }
    });

    return stats;
  }

  private async getFormCategoriesStats() {
    // Define form categories based on formType
    const categories = [
      {
        name: 'Inventory Exceptions',
        types: ['inventory-exception', 'inventory exception', 'inventory'],
      },
      {
        name: 'Slow Moving Items',
        types: ['slow-moving-items', 'slow moving items', 'slow-moving'],
      },
      {
        name: 'Essentials Alerts',
        types: ['essentials-alerts', 'essentials alerts', 'essentials'],
      },
      {
        name: 'Equipment & Facility Alerts',
        types: [
          'equipment-facility',
          'equipment facility',
          'equipment',
          'facility',
        ],
      },
      {
        name: 'Alert Reminders & Follow Ups',
        types: [
          'alert-reminders',
          'alert reminders',
          'follow-ups',
          'follow ups',
        ],
      },
      {
        name: 'Handover Notes',
        types: ['handover-notes', 'handover notes', 'handover'],
      },
      {
        name: 'Customer Feedback',
        types: ['customer-feedback', 'customer feedback', 'feedback'],
      },
      {
        name: 'Health & Safety Alerts',
        types: ['health-safety', 'health safety', 'safety'],
      },
    ];

    const categoryStats = await Promise.all(
      categories.map(async (category) => {
        const forms = await this.formModel
          .find({
            formType: {
              $in: category.types.map((type) => new RegExp(type, 'i')),
            },
          })
          .exec();

        const stats = {
          pending: 0,
          inProgress: 0,
          completed: 0,
          moved: 0,
        };

        forms.forEach((form) => {
          switch (form.status.toLowerCase()) {
            case 'pending':
              stats.pending++;
              break;
            case 'in-progress':
            case 'in progress':
              stats.inProgress++;
              break;
            case 'completed':
              stats.completed++;
              break;
            case 'moved':
              stats.moved++;
              break;
          }
        });

        return {
          name: category.name,
          ...stats,
          total: forms.length,
        };
      })
    );

    return categoryStats;
  }

  private async getPerformanceMetrics() {
    const completedForms = await this.formModel
      .find({
        status: 'completed',
        $expr: { $gte: [{ $size: '$history' }, 2] }, // At least 2 history entries (created + completed)
      })
      .exec();

    const completionTimes = completedForms
      .map((form) => {
        const createdAt = form.createdAt;
        const completedEntry = form.history.find(
          (entry) => entry.status.toLowerCase() === 'completed'
        );

        if (completedEntry) {
          const completedAt = completedEntry.timestamp;
          return completedAt.getTime() - createdAt.getTime(); // milliseconds
        }
        return null;
      })
      .filter((time) => time !== null);

    if (completionTimes.length === 0) {
      return {
        averageCompletionTime: 0,
        fastestCompletion: 0,
        slowestCompletion: 0,
        totalCompletedForms: 0,
      };
    }

    const avgTime =
      completionTimes.reduce((sum, time) => sum + time, 0) /
      completionTimes.length;
    const fastestTime = Math.min(...completionTimes);
    const slowestTime = Math.max(...completionTimes);

    return {
      averageCompletionTime: Math.round(avgTime / (1000 * 60 * 60)), // Convert to hours
      fastestCompletion: Math.round(fastestTime / (1000 * 60 * 60)), // Convert to hours
      slowestCompletion: Math.round(slowestTime / (1000 * 60 * 60)), // Convert to hours
      totalCompletedForms: completedForms.length,
    };
  }

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
