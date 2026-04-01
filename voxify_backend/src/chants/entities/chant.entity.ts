import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ChantDocument = Chant & Document;

@Schema({ timestamps: true })
export class Chant{
    @Prop({ required: true })
    title: string;

    @Prop()
    categorie: string;

    @Prop()
    lyrics: string;

    @Prop({ type: Object })
    voices: {
        soprano?: string;
        alto?: string;
        tenor?: string;
        bass?: string;
    };
}

export const ChantSchema = SchemaFactory.createForClass(Chant);