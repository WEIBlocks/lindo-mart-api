import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Actions extends Document {
  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    enum: [
      "inventory",
      "equipment",
      "operational-alerts",
      "handover-alerts",
      "customer-feedback",
      "health-safety",
      "disaster-preparedness"
    ],
  })
  type: string;
}

export const ActionsSchema = SchemaFactory.createForClass(Actions);

// Create indexes for better performance
ActionsSchema.index({ description: 1 });
ActionsSchema.index({ type: 1 });
ActionsSchema.index({ description: 1, type: 1 }, { unique: true });
