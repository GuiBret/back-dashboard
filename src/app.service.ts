import { Injectable, OnModuleInit } from '@nestjs/common';
import { EasyconfigService } from 'nestjs-easyconfig';
import { Connection, Model } from 'mongoose';
import { TodoMongoose } from 'backend/models/todo.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Observable, observable } from 'rxjs';
import { stringify } from 'querystring';
import * as mongoose from 'mongoose';

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

  saveTodos(todoListToAdd: Array<TodoMongoose>): Observable<any>{

    return new Observable((observer) => {
      
        this.todoModel.create(todoListToAdd).then((response) => {
          
          observer.next({status: 'OK', list: response});
          observer.complete();
          return response;
        }).catch((err) => {
          observer.error(err);
          observer.complete();
        })
    });

    
    
  }

  editTodo(idTodo: string, todo: TodoMongoose) {

    return new Promise(async (resolve, reject) => {

      todo._id = mongoose.Types.ObjectId(idTodo);
      
      
    // const todoToEdit = await this.todoModel.findById(mongoose.Types.ObjectId(idTodo)).exec();
      const todoToEdit = await this.todoModel.findOne(mongoose.Types.ObjectId(idTodo)).exec();
      
      if(!todoToEdit) {
        resolve({status: 'KO', error: 'NOT_FOUND'});
      } else {
        todoToEdit.updateOne(todo).exec();
        resolve({status: 'OK'});
      }
      
    });

  } 
  
}


 