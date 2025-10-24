import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class OperationalAlert extends Document {
  @Prop({ required: true })
  itemName: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  subcategory: string;

  @Prop({ required: true })
  actionNeeded: string;
}

export const OperationalAlertSchema = SchemaFactory.createForClass(OperationalAlert);

// Create indexes for better performance
OperationalAlertSchema.index({ category: 1 });
OperationalAlertSchema.index({ subcategory: 1 });
OperationalAlertSchema.index({ itemName: 1 });
OperationalAlertSchema.index({ actionNeeded: 1 });
