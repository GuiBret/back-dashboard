import { Controller, Get, Post, Req, Request, ParamData, Param, Delete } from '@nestjs/common';
import { AppService } from './app.service';
import { TodoMongoose } from 'backend/models/todo.schema';
import * as mongoose from 'mongoose';

@Controller()
export class AppController {


  constructor(private readonly appService: AppService)  {}




  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('todos')
  getAllTodos() {
    return this.appService.getTodos();
  }

  @Post('todos') 
  saveTodos(@Req() request){
    const form: any = request.body;
    const todos = form.todos;

    return this.appService.saveTodos(todos);
  }

  @Post('todos/:idtodo')
  editTodo(@Req() request: Request, @Param() params) : Promise<any>{

    
    const form : any = request.body;
    const idTodo: string = params.idtodo;
    const todoData : TodoMongoose = form.todo;
    return this.appService.editTodo(idTodo, todoData);
    
    // return this.appService.saveTodos(todoData);
  }

  @Delete('todos/:idtodo')
  deleteTodo(@Req() request: Request, @Param() params) {
    const idTodo: string = params.idtodo;

    return this.appService.deleteTodo(idTodo);
  }
}
