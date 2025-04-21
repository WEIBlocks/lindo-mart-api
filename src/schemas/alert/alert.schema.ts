import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Alert extends Document {
  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  role: string;

  @Prop()
  userId?: string;

  @Prop({ type: [String], required: true })
  categories: string[];

  @Prop()
  relatedId?: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);
