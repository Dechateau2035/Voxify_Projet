import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChantDocument = Chant & Document;
export type Media = {
  url: string;
  public_id: string;
  duration?: number;
  format?: string;
};

export type ChantVoice = {
  name: string;
  audio: Media;
};

export enum ChantCategory {
  ADORATION = 'adoration',
  LOUANGE = 'louange',
  OFFERTOIRE = 'offertoire',
  ENTREE = 'entrée',
}

@Schema({ timestamps: true })
export class Chant {
  @Prop({ required: true })
  title!: string;

  @Prop({ unique: true })
  slug!: string;

  @Prop()
  normalizedTitle!: string;

  @Prop({
    enum: Object.values(ChantCategory),
    required: false,
  })
  category?: string;

  @Prop()
  lyrics?: string;

  @Prop({ type: Object, default: null })
  coverImage?: Media | null;

  @Prop({ type: Object, default: null })
  audio?: Media | null;

  @Prop({ type: Object, default: null })
  sheetMusic?: Media | null;

  @Prop({
    type: [
      {
        name: { type: String, required: true, trim: true },
        audio: { type: Object, required: true },
      },
    ],
    default: [],
  })
  voices!: ChantVoice[];

  @Prop([String])
  tags?: string[];

  @Prop({ default: false })
  isPublished!: boolean;

  @Prop({ default: 0 })
  views!: number;

  @Prop({ default: 0 })
  plays!: number;

  @Prop({ default: 0 })
  likes!: number;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId;
}

export const ChantSchema = SchemaFactory.createForClass(Chant);
ChantSchema.index({ title: 'text', lyrics: 'text' });
ChantSchema.index({ category: 1 });
ChantSchema.index({ tags: 1 });
