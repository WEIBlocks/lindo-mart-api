import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Form extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  formType: string;

  @Prop({ type: Object, required: true })
  formData: Record<string, any>;

  @Prop({ default: 'Pending' })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
  recipient: string;

  @Prop()
  alertId?: string;

  @Prop()
  signatureUrl?: string;

  @Prop({
    type: [
      {
        status: String,
        timestamp: Date,
        userId: String,
        fromUserId: String,
        toUserId: String,
      },
    ],
    default: [],
  })
  history: {
    status: string;
    timestamp: Date;
    userId: string;
    fromUserId: string;
    toUserId: string;
  }[];
}

export const FormSchema = SchemaFactory.createForClass(Form);
