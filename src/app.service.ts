import { Injectable, OnModuleInit } from '@nestjs/common';
import { EasyconfigService } from 'nestjs-easyconfig';
import { Connection, Model } from 'mongoose';
import { TodoMongoose } from 'backend/models/todo.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AppService {

  

  constructor(@InjectModel(TodoMongoose.name) private todoModel: Model<TodoMongoose>) {
    
  }
  
  getHello(): string {
    return 'Hello World!';
  }

  getTodos() { 
    
    return this.todoModel.find().exec();
     
  }

  addTodo(todoToAdd: TodoMongoose) {
    this.todoModel.create(todoToAdd);
  }
}
 