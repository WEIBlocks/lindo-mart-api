import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class InventoryItem extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ 
    required: true,
    enum: [
      'Pieces', 'Boxes', 'Cartons', 'Bags', 'Bottles', 'Cans', 
      'Packets', 'Rolls', 'Sheets', 'Units', 'Kilograms', 
      'Grams', 'Liters', 'Meters'
    ]
  })
  unitOfMeasure: string;

  @Prop({ 
    required: true,
    enum: [
      '1', '2', '3', '4', '5', '6', '8', '10', '12', '15', '20', '24', 
      '25', '30', '36', '48', '50', '60', '72', '100', '120', '144', 
      '200', '250', '300', '500', '1000'
    ]
  })
  unitsPerPackage: string;

  @Prop({ required: true })
  reorderLevel: string;

  @Prop({ default: false })
  perishable: boolean;

  @Prop({ default: false })
  essential: boolean;

  @Prop({ default: 'active' })
  status: string;

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const InventoryItemSchema = SchemaFactory.createForClass(InventoryItem);

// Create indexes for better performance
InventoryItemSchema.index({ perishable: 1 });
InventoryItemSchema.index({ essential: 1 });
InventoryItemSchema.index({ status: 1 });