import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Actions extends Document {
  @Prop({ required: true })
  description: string;
}

export const ActionsSchema = SchemaFactory.createForClass(Actions);

// Create indexes for better performance
ActionsSchema.index({ description: 1 });
