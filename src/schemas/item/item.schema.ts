import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Item extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  categories: string[];

  @Prop({ type: String, default: '' })
  minimumLevel: string;

  @Prop({ type: [String], default: [] })
  actionsNeeded: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
