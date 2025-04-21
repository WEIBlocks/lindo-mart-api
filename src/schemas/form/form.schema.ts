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
}

export const FormSchema = SchemaFactory.createForClass(Form);
