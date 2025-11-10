import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true })





  
  name: string;

  @Prop({ type: [String], required: true })
  subcategories: string[];

  @Prop({ 
    required: true, 
    enum: [
      'inventory',
      'equipment',
      'operational-alerts',
      'handover-alerts',
      'customer-feedback',
      'health-safety',
      'disaster-preparedness'
    ] 
  })
  type: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Create indexes for better performance
CategorySchema.index({ type: 1 });
CategorySchema.index({ name: 1, type: 1 }, { unique: true });
