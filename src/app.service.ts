import {
  Injectable,
  OnModuleInit,
  HttpServer,
  HttpService,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { TodoMongoose } from '@models/todos/todo.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Observable } from 'rxjs';
import * as mongoose from 'mongoose';

@Injectable()
export class AppService {
  clientId = '';
  clientSecret = '';
  spotify_token = '';

  constructor(
    // @InjectModel(TodoMongoose.name) private todoModel: Model<TodoMongoose>,
    private http: HttpService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  // getTodos() {

  //   return this.todoModel.find().exec();

  // }

  // addTodo(todoToAdd: TodoMongoose) {
  //   return new Promise(async (resolve, reject) => {
  //     const todo = await this.todoModel.create(todoToAdd);

  //     console.log(todo);

  //     resolve({status: 'OK', newList: await this.getTodos()});
  //   })

  // }

  // saveTodos(todoListToAdd: Array<TodoMongoose>): Observable<any>{

  //   return new Observable((observer) => {

  //       this.todoModel.create(todoListToAdd).then((response) => {

  //         observer.next({status: 'OK', list: response});
  //         observer.complete();
  //         return response;
  //       }).catch((err) => {
  //         observer.error(err);
  //         observer.complete();
  //       })
  //   });

  // }

  // editTodo(idTodo: string, todo: TodoMongoose) {

  //   return new Promise(async (resolve, reject) => {

  //     // todo._id = mongoose.Types.ObjectId(idTodo);

  //   const todoToEdit = await this.todoModel.findById(mongoose.Types.ObjectId(idTodo)).exec();
  //     // const todoToEdit = await this.todoModel.findById(idTodo).exec();

  //     if(!todoToEdit) {
  //       resolve({status: 'KO', error: 'NOT_FOUND'});
  //     } else {
  //       todoToEdit.updateOne(todo).exec();
  //       resolve({status: 'OK'});
  //     }

  //   });

  // }

  // deleteTodo(idTodo: string) {
  //   return new Promise(async (resolve, reject) => {

  //     const todoToDelete = await this.todoModel.findByIdAndDelete(mongoose.Types.ObjectId(idTodo)).exec();

  //   if(todoToDelete) {

  //     resolve({status: 'OK', newList: await this.getTodos()});

  //   } else {
  //     resolve({status: 'KO', error: 'NOT_FOUND'});
  //   }

  //   });
  // }
}
