import { Injectable, HttpService } from '@nestjs/common';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from '@models/todos/todo.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Observable } from 'rxjs';
import * as mongoose from 'mongoose';


@Injectable()
export class AppService {
  clientId = '';
  clientSecret = '';
  spotify_token = '';

  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>, private http: HttpService) {}

  getTodos(): Promise<any> {
    return this.todoModel.find().exec();

  }

  addTodo(todoToAdd: TodoDocument) : Promise<{status: string, newList: Array<any>}> {
    return new Promise(async(resolve) => {
      await this.todoModel.create(todoToAdd);

      resolve({status: 'OK', newList: await this.getTodos()});
    });

  }

  saveTodos(todoListToAdd: Array<TodoDocument>): Observable<any>{

    return new Observable((observer) => {

        this.todoModel.create(todoListToAdd).then((response) => {

          observer.next({status: 'OK', list: response});
          observer.complete();
          return response;
        }).catch((err) => {
          observer.error(err);
          observer.complete();
        });
    });



  }

  editTodo(idTodo: string, todo: TodoDocument): Promise<{status: string, error?: string }> {

    return new Promise(async(resolve) => {

    const todoToEdit = await this.todoModel.findById(mongoose.Types.ObjectId(idTodo)).exec();

      if(!todoToEdit) {
        resolve({status: 'KO', error: 'NOT_FOUND'});
      } else {
        todoToEdit.updateOne(todo).exec();
        resolve({status: 'OK'});
      }
    });
  }

  deleteTodo(idTodo: string): Promise<{status: string, error?: string, newList?: Todo[]}> {
    return new Promise(async(resolve) => {

      const todoToDelete = await this.todoModel.findByIdAndDelete(mongoose.Types.ObjectId(idTodo)).exec();

    if(todoToDelete) {

      resolve({status: 'OK', newList: await this.getTodos()});

    } else {
      resolve({status: 'KO', error: 'NOT_FOUND'});
    }




    });
  }


}


