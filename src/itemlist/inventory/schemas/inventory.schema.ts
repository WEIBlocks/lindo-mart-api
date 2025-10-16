import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class InventoryItem extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  unitOfMeasure: string;

  @Prop({ required: true, min: 0 })
  unitsPerPackage: number;

  @Prop({ required: true })
  reorderLevel: string;

  @Prop({ default: false })
  perishable: boolean;

  @Prop({ default: false })
  essential: boolean;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  subcategory: string;

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const InventoryItemSchema = SchemaFactory.createForClass(InventoryItem);

// Create indexes for better performance
InventoryItemSchema.index({ perishable: 1 });
InventoryItemSchema.index({ essential: 1 });
InventoryItemSchema.index({ unitOfMeasure: 1 });
InventoryItemSchema.index({ category: 1 });
InventoryItemSchema.index({ subcategory: 1 });