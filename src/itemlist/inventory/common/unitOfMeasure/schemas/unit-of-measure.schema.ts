import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class UnitOfMeasure extends Document {
  @Prop({ required: true, unique: true })
  fullName: string; // e.g., "Kilograms"

  @Prop({ required: true, unique: true })
  shortName: string; // e.g., "kg"
}

export const UnitOfMeasureSchema = SchemaFactory.createForClass(UnitOfMeasure);

// Create indexes for better performance
UnitOfMeasureSchema.index({ fullName: 1 });
UnitOfMeasureSchema.index({ shortName: 1 });
