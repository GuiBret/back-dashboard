import { Document } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema()
export class TodoMongoose extends Document {
    @Prop({required: true})
    title: string;
    
    @Prop({required: true})
    content: string;
}



export const Todo = SchemaFactory.createForClass(TodoMongoose)