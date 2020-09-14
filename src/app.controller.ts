import { Controller, Get, Post, Req, Request, ParamData, Param } from '@nestjs/common';
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

  @Post('todos/:idtodo/edit')
  editTodo(@Req() request: Request, @Param() params) {

    
    const form : any = request.body;
    const idTodo: string = params.idtodo;
    const todoData : TodoMongoose = form.todo;
    return this.appService.editTodo(idTodo, todoData);
    
    // return this.appService.saveTodos(todoData);
  }
}
