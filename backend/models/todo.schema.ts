import { Document } from 'mongoose';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
@Schema()
export class TodoMongoose extends Document {

    @Prop()
    _id: mongoose.Types.ObjectId;
    
    @Prop({required: true})
    title: string;
    
    @Prop({required: true})
    content: string;

    @Prop({default: false})
    status: boolean;
}



export const Todo = SchemaFactory.createForClass(TodoMongoose)