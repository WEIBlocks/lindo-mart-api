import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Packaging extends Document {
  @Prop({ required: true, unique: true })
  name: string; // e.g., "Box", "Carton", "Bottle"
}

export const PackagingSchema = SchemaFactory.createForClass(Packaging);

// Create indexes for better performance
PackagingSchema.index({ name: 1 });
