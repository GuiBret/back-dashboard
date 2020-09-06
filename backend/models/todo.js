import { Schema, model } from 'mongoose';

const todoSchema = Schema({
    title: {
        type: string,
        required: true
    },
    content: {
        type: string,
        required: true
    }
});

export default model('Todo', todoSchema);