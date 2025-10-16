import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ReasonCode extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

export const ReasonCodeSchema = SchemaFactory.createForClass(ReasonCode);

// Create indexes for better performance
ReasonCodeSchema.index({ name: 1 });
