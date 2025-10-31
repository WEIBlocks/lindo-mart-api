import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class OperationalAlert extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  subcategory: string;

  @Prop({ required: true })
  actionNeeded: string;

  @Prop({ 
    required: true,
    enum: ['operational-alerts', 'handover-alerts', 'customer-feedback', 'health-safety', 'disaster-preparedness'],
    default: 'operational-alerts'
  })
  type: string;
}

export const OperationalAlertSchema = SchemaFactory.createForClass(OperationalAlert);

// Create indexes for better performance
OperationalAlertSchema.index({ category: 1 });
OperationalAlertSchema.index({ subcategory: 1 });
OperationalAlertSchema.index({ name: 1 });
OperationalAlertSchema.index({ actionNeeded: 1 });
OperationalAlertSchema.index({ type: 1 });
