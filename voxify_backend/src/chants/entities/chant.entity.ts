import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ChantDocument = Chant & Document;

@Schema({ timestamps: true })
export class Chant {
    @Prop({ required: true })
    title: string;

    @Prop({ unique: true })
    slug: string;

    @Prop()
    category: string;

    @Prop()
    lyrics: string;

    @Prop()
    audioUrl: string;

    @Prop()
    coverImage: string;


    @Prop({ type: Object })
    voices: {
        soprano?: string;
        alto?: string;
        tenor?: string;
        bass?: string;
    };

    @Prop([String])
    tags: string[];

    @Prop({ default: false })
    isPublished: boolean;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    createdBy: Types.ObjectId;
}

export const ChantSchema = SchemaFactory.createForClass(Chant);