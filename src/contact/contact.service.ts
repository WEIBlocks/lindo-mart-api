import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from '../schemas/contact.schema';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>
  ) {}

  async create(contactData: Partial<Contact>): Promise<Contact> {
    const createdContact = new this.contactModel(contactData);
    return createdContact.save();
  }

  async findAll(): Promise<Contact[]> {
    return this.contactModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<Contact> {
    return this.contactModel.findById(id).exec();
  }

  async markAsResolved(id: string): Promise<Contact> {
    return this.contactModel
      .findByIdAndUpdate(id, { isResolved: true }, { new: true })
      .exec();
  }
}
