import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Form } from '../schemas/form/form.schema';
import { AlertsService } from '../alerts/alerts.service';
import { User } from '../schemas/user/user.schema';
import { CloudinaryService } from '../common/cloudinary.service';

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(Form.name) private formModel: Model<Form>,
    @InjectModel(User.name) private userModel: Model<User>,
    private alertsService: AlertsService,
    private cloudinaryService: CloudinaryService
  ) {}

  async submitForm(userId: string, formData: any, recipient: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user identifier');
    }
    const userObjectId = new Types.ObjectId(userId);

    // Extract fields from request body
    const {
      formType,
      notes,
      selectedItems,
      forDate,
      recipientType,
      generalRecipient,
    } = formData;

    // Map selectedItems to formData array (schema expects formData as array)
    const formDataArray: Array<Record<string, any>> = Array.isArray(
      selectedItems
    )
      ? selectedItems
      : [];

    // Convert forDate string to Date object (e.g., "2025-11-06" -> Date)
    const forDateObj = forDate ? new Date(forDate) : new Date();

    const inferredRecipientType =
      recipientType ||
      (recipient && Types.ObjectId.isValid(recipient) ? 'specific' : 'general');

    let specificRecipientId: Types.ObjectId | undefined;
    let resolvedGeneralRecipient: string | undefined;

    if (inferredRecipientType === 'specific') {
      if (!recipient || !Types.ObjectId.isValid(recipient)) {
        throw new BadRequestException(
          'Specific recipient must be a valid user identifier'
        );
      }
      specificRecipientId = new Types.ObjectId(recipient);
    } else {
      resolvedGeneralRecipient = generalRecipient || recipient || 'general';
    }

    const newForm = new this.formModel({
      userId: userObjectId,
      formType,
      formData: formDataArray,
      forDate: forDateObj,
      notes: notes || '',
      recipientType: inferredRecipientType,
      recipient: specificRecipientId,
      generalRecipient: resolvedGeneralRecipient,
      status: 'Pending',
      history: [
        {
          status: 'Pending',
          timestamp: new Date(),
          userId: userObjectId,
          fromUserId: userObjectId,
          toUserId: specificRecipientId ?? resolvedGeneralRecipient ?? 'general',
        },
      ],
    });
    const savedForm = await newForm.save();

    // Generate alert for the recipient
    // const alertId = await this.alertsService.sendAlert(
    //   'New Form Received',
    //   savedForm._id.toString(),
    //   userId,
    //   recipient || formData.recipient,
    //   null
    // );

    // Update form with alertId
    // savedForm.alertId = alertId;
    await savedForm.save();

    return savedForm;
  }

  async getUserForms(userId: string, formType?: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user identifier');
    }
    const query: Record<string, unknown> = {
      userId: new Types.ObjectId(userId),
    };
    if (formType) {
      query.formType = formType;
    }
    return this.formModel
      .find(query)
      .select('-formData -history')
      .populate('userId', 'username role')
      .populate({
        path: 'recipient',
        select: 'username role',
      })
      .exec();
  }

  async getFormStatus(userId: string, formId: string) {
    const form = await this.formModel
      .findOne({
        _id: formId,
        // $or: [{ userId }, { recipient: userId }],
      })
      .exec();

    if (!form) {
      throw new NotFoundException('Form not found');
    }

    // Convert form to plain object to modify
    const formObj: any = form.toObject();

    const normalizeToObjectIdString = (value: any) => {
      if (!value) {
        return undefined;
      }
      if (value instanceof Types.ObjectId) {
        return value.toHexString();
      }
      if (typeof value === 'string') {
        return value;
      }
      return undefined;
    };

    // Populate userId with user details
    if (formObj.userId) {
      try {
        const user = await this.userModel
          .findById(formObj.userId)
          .select('username email role phoneNumber')
          .exec();

        if (user) {
          formObj.userId = {
            _id: user._id,
            username: user.username,

            role: user.role,
          };
        }
      } catch (error) {
        console.log('Error populating userId:', error);
      }
    }

    // Populate recipient details
    if (formObj.recipientType === 'specific' && formObj.recipient) {
      try {
        const recipientUser = await this.userModel
          .findById(formObj.recipient)
          .select('username email role phoneNumber')
          .exec();

        if (recipientUser) {
          formObj.recipient = {
            _id: recipientUser._id,
            username: recipientUser.username,
            role: recipientUser.role,
          };
        }
      } catch (error) {
        console.log('Error populating specific recipient:', error);
      }
    } else if (formObj.recipientType === 'general') {
      formObj.recipient = formObj.generalRecipient || 'general';
    }

    // Populate fromUserId and toUserId in history array
    if (formObj.history && Array.isArray(formObj.history)) {
      for (const historyEntry of formObj.history) {
        // Populate fromUserId
        const fromUserId = normalizeToObjectIdString(historyEntry.fromUserId);
        if (fromUserId && Types.ObjectId.isValid(fromUserId)) {
          try {
            const fromUser = await this.userModel
              .findById(fromUserId)
              .select('username email role phoneNumber')
              .exec();

            if (fromUser) {
              historyEntry.fromUserId = {
                _id: fromUser._id,
                username: fromUser.username,
                role: fromUser.role,
              };
            }
          } catch (error) {
            console.log('Error populating fromUserId in history:', error);
          }
        }

        // Populate toUserId
        const toUserId = normalizeToObjectIdString(historyEntry.toUserId);
        if (toUserId && Types.ObjectId.isValid(toUserId)) {
          try {
            const toUser = await this.userModel
              .findById(toUserId)
              .select('username email role phoneNumber')
              .exec();

            if (toUser) {
              historyEntry.toUserId = {
                _id: toUser._id,
                username: toUser.username,
                role: toUser.role,
              };
            }
          } catch (error) {
            console.log('Error populating toUserId in history:', error);
          }
        }

        // Populate userId in history (the user who made the change)
        if (historyEntry.userId) {
          try {
            const historyUser = await this.userModel
              .findById(historyEntry.userId)
              .select('username email role phoneNumber')
              .exec();

            if (historyUser) {
              historyEntry.userId = {
                _id: historyUser._id,
                username: historyUser.username,
                role: historyUser.role,
              };
            }
          } catch (error) {
            console.log('Error populating userId in history:', error);
          }
        }
      }
    }

    return formObj;
  }

  async updateFormStatus(
    user: any,
    formId: string,
    newStatus: string,
    signatureImage?: string
  ) {
    const userId = user.userId;
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user identifier');
    }
    const userObjectId = new Types.ObjectId(userId);
    console.log(
      `Attempting to update form status for form ID: ${formId}, user ID: ${userId}, new status: ${newStatus}, signatureImage: ${signatureImage ? 'provided' : 'not provided'}`
    );
    // Find form where recipient matches the user (specific) or their role/general target
    const recipientConditions = [
      { recipientType: 'specific', recipient: userObjectId },
      ...[user.role, 'general']
        .filter((target) => typeof target === 'string' && target.length > 0)
        .map((target) => ({
          recipientType: 'general',
          generalRecipient: target,
        })),
    ];

    const form = await this.formModel
      .findOne({
        _id: formId,
        $or: recipientConditions,
      })
      .exec();

    if (!form) {
      console.error(`Form with ID ${formId} not found for user ID: ${userId}`);
      throw new NotFoundException('Form not found');
    }

    // If signature image is provided, upload it to Cloudinary
    if (signatureImage) {
      try {
        const signatureUrl = await this.cloudinaryService.uploadSignature(
          signatureImage,
          userId
        );
        form.signatureUrl = signatureUrl;
        console.log(`Signature uploaded successfully for user ID: ${userId}`);
      } catch (error) {
        console.error(
          `Error uploading signature for user ID: ${userId}:`,
          error
        );
        // Continue form update even if signature upload fails
      }
    }

    // Update form status
    form.status = newStatus;
    form.history.push({
      status: newStatus,
      timestamp: new Date(),
      userId: userObjectId,
      fromUserId: null,
      toUserId: null,
    });
    await form.save();
    console.log(
      `Form status updated successfully for form ID: ${formId}, new status: ${newStatus}`
    );

    // Extract unique user IDs from form.history
    // const userIds = Array.from(
    //   new Set(
    //     form.history.flatMap((entry) => [entry.fromUserId, entry.toUserId])
    //   )
    // ).filter((id) => id); // Filter out any undefined or null values

    // await this.alertsService.sendAlert(
    //   `Form ${form._id} status has been updated to ${newStatus}`,
    //   form._id.toString(),
    //   userId,
    //   null,
    //   userIds
    // );
    // console.log(`Alert sent successfully for form ID: ${form._id}, new status: ${newStatus}`);

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

    const formatForms = (forms: Array<Form>) =>
      forms.map((form) => {
        const formObj: any = form.toObject();
        if (formObj.recipientType === 'general') {
          formObj.recipient = formObj.generalRecipient || 'general';
        }
        return formObj;
      });

    // Super Admin can view all forms without filtering
    if (user.role === 'Super-Admin') {
      const allForms = await this.formModel
        .find()
        .select('-formData -history')
        .populate('userId', 'username role')
        .populate({
          path: 'recipient',
          select: 'username role',
          strictPopulate: false,
        })
        .exec();

      return formatForms(allForms);
    }

    const userObjectId = Types.ObjectId.isValid(userId)
      ? new Types.ObjectId(userId)
      : null;

    if (!userObjectId) {
      return [];
    }

    const forms = await this.formModel
      .find({
        recipientType: 'specific',
        recipient: userObjectId,
      })
      .select('-formData -history')
      .populate('userId', 'username role')
      .populate({
        path: 'recipient',
        select: 'username role',
        strictPopulate: false,
      })
      .exec();

    // Format general forms to show generalRecipient
    return formatForms(forms);
  }

  async moveForm(
    userId: string,
    formId: string,
    newRecipient: string,
    signatureImage?: string
  ) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user identifier');
    }
    const userObjectId = new Types.ObjectId(userId);

    const form = await this.formModel.findById(formId).exec();
    if (!form) {
      throw new NotFoundException('Form not found');
    }

    // If signature image is provided, upload it to Cloudinary
    if (signatureImage) {
      try {
        const signatureUrl = await this.cloudinaryService.uploadSignature(
          signatureImage,
          userId
        );
        form.signatureUrl = signatureUrl;
      } catch (error) {
        console.error('Error uploading signature:', error);
        // Continue form moving even if signature upload fails
      }
    }

    // Update form status and recipient
    const recipientIsObjectId = Types.ObjectId.isValid(newRecipient);
    if (recipientIsObjectId) {
      form.recipientType = 'specific';
      form.recipient = new Types.ObjectId(newRecipient);
      form.generalRecipient = undefined;
    } else {
      form.recipientType = 'general';
      form.recipient = undefined;
      form.generalRecipient = newRecipient;
    }

    form.history.push({
      status: form.status,
      timestamp: new Date(),
      userId: userObjectId,
      fromUserId: userObjectId,
      toUserId: recipientIsObjectId
        ? new Types.ObjectId(newRecipient)
        : newRecipient,
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
      formId,
      userId,
      newRecipient,
      null
    );

    // Fetch the updated form with populated user details
    const updatedForm = await this.formModel
      .findById(formId)
      .select('-formData -history')
      .populate('userId', 'username role')
      .populate({
        path: 'recipient',
        select: 'username role',
        strictPopulate: false,
      })
      .exec();

    if (!updatedForm) {
      throw new NotFoundException('Form not found after update');
    }

    // Format general forms to show generalRecipient
    const formObj: any = updatedForm.toObject();
    if (formObj.recipientType === 'general') {
      formObj.recipient = formObj.generalRecipient || 'general';
    }

    return {
      message: 'Form moved successfully',
      form: formObj,
    };
  }

  async getMovedForms(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const movedForms = user.movedForms;
    const populatedForms = await Promise.all(
      movedForms.map(async (movedForm) => {
        const form = await this.formModel
          .findById(movedForm.formId)
          .select('-formData -history')
          .populate('userId', 'username role')
          .populate({
            path: 'recipient',
            select: 'username role',
            strictPopulate: false,
          })
          .exec();

        if (!form) {
          return {
            formId: movedForm.formId,
            formData: null,
          };
        }

        // Format general forms to show generalRecipient
        const formObj: any = form.toObject();
        if (formObj.recipientType === 'general') {
          formObj.recipient = formObj.generalRecipient || 'general';
        }

        return {
          formId: movedForm.formId,
          formData: {
            status: formObj.status,
            _id: formObj._id,
            userId: formObj.userId,
            formType: formObj.formType,
            recipient: formObj.recipient,
            recipientType: formObj.recipientType,
            generalRecipient: formObj.generalRecipient,
            forDate: formObj.forDate,
            notes: formObj.notes,
            createdAt: formObj.createdAt,
            alertId: formObj.alertId,
            signatureUrl: formObj.signatureUrl,
          },
        };
      })
    );

    return populatedForms;
  }
}
