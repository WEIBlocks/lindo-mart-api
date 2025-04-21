import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Form } from '../schemas/form/form.schema';

@Injectable()
export class FormsService {
  constructor(@InjectModel(Form.name) private formModel: Model<Form>) {}

  async submitForm(userId: string, formData: any) {
    const newForm = new this.formModel({
      ...formData,
      userId,
      status: 'Pending',
    });
    return newForm.save();
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
}
