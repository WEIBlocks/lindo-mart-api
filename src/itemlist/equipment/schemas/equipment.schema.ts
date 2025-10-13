import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class EquipmentItem extends Document {
  @Prop({ required: true })
  itemName: string;

  @Prop({ required: true })
  description: string;

  @Prop({ 
    required: true,
    enum: [
      'Equipment Alert',
      'Facility Alert'
    ]
  })
  category: string;

  @Prop({ 
    required: true,
    enum: [
      'Freezer/Chiller',
      'Scales', 
      'Other',
      'Restrooms',
      'Electricals',
      'Flooding'
    ]
  })
  subcategory: string;

  @Prop({ required: true })
  location: string;

  @Prop({ default: '' })
  maintenanceNotes: string;
}

export const EquipmentItemSchema = SchemaFactory.createForClass(EquipmentItem);

// Create indexes for better performance
EquipmentItemSchema.index({ category: 1 });
EquipmentItemSchema.index({ subcategory: 1 });
EquipmentItemSchema.index({ location: 1 });
