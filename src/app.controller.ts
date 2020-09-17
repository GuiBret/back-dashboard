/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Get, Post, Req, Request, Param, Delete, Put, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { TodoMongoose } from 'backend/models/todo.schema';
import * as mongoose from 'mongoose';
import * as fs from 'fs';
import * as querystring from 'querystring';

@Controller()
export class AppController {
  clientId = '';
  clientSecret = '';

  constructor(private readonly appService: AppService)  {}

  @Get('todos')
  getAllTodos() {
    return this.appService.getTodos();
  }

  @Post('todos/save') 
  saveTodos(@Req() request){
    const form: any = request.body;
    const todos = form.todos;

    return this.appService.saveTodos(todos);
  }

  @Put('todos/:idtodo')
  editTodo(@Req() request: Request, @Param() params) : Promise<any>{

    
    const form : any = request.body;
    const idTodo: string = params.idtodo;
    const todoData : TodoMongoose = form.todo;
    todoData._id = mongoose.Types.ObjectId(idTodo);
    return this.appService.editTodo(idTodo, todoData);
    
    // return this.appService.saveTodos(todoData);
  }

  @Post('todos')
  addTodo(@Req() request: Request) {
    const form : any = request.body;
    
    const todoData : TodoMongoose = form.todo;
    todoData._id = mongoose.Types.ObjectId();
    return this.appService.addTodo(todoData);
  }

  @Delete('todos/:idtodo')
  deleteTodo(@Req() request: Request, @Param() params) {
    const idTodo: string = params.idtodo;

    return this.appService.deleteTodo(idTodo);
  }


}
