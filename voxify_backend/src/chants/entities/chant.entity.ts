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

    @Prop({type: Object,  default: null})
    coverImage?: {url: string, public_id: string};

    @Prop({type: Object,  default: null})
    audioUrl?: {url: string, public_id: string};

    @Prop({ type: Object })
    voices: {
        soprano?: { url: string, public_id: string };
        alto?: { url: string, public_id: string };
        tenor?: { url: string, public_id: string };
        bass?: { url: string, public_id: string };
    };

    @Prop([String])
    tags: string[];

    @Prop({ default: false })
    isPublished: boolean;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    createdBy: Types.ObjectId;
}

export const ChantSchema = SchemaFactory.createForClass(Chant);