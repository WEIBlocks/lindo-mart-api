import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

@Schema()
export class Form extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  formType: string;
  @Prop({ required: true })
  forDate: Date;

  @Prop({ type: [SchemaTypes.Mixed], required: true })
  formData: Array<Record<string, any>>;

  @Prop({ default: 'Pending' })
  status: string;

  @Prop()
  notes?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({
    type: String,
    enum: ['general', 'specific'],
    required: true,
  })
  recipientType: 'general' | 'specific';

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  recipient?: Types.ObjectId;

  @Prop()
  generalRecipient?: string;

  @Prop()
  alertId?: string;

  @Prop()
  signatureUrl?: string;

  @Prop({
    type: [
      {
        status: String,
        timestamp: Date,
        userId: { type: SchemaTypes.ObjectId, ref: 'User' },
        fromUserId: SchemaTypes.Mixed,
        toUserId: SchemaTypes.Mixed,
      },
    ],
    default: [],
  })
  history: {
    status: string;
    timestamp: Date;
    userId: Types.ObjectId;
    fromUserId: Types.ObjectId | string;
    toUserId: Types.ObjectId | string;
  }[];
}

export const FormSchema = SchemaFactory.createForClass(Form);
