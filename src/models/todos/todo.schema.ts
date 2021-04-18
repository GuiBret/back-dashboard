import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type TodoDocument = Todo & mongoose.Document;

@Schema()
export class Todo {
    @Prop()
    _id: mongoose.Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ default: false })
    status: boolean;
}


export const TodoSchema = SchemaFactory.createForClass(Todo);