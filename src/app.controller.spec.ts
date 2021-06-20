import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as mongoose from 'mongoose';

describe('AppController', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let appController: AppController;
  const appServiceStub: Partial<AppService> = {
    getTodos: jest.fn(),
    editTodo: jest.fn()
  };

  beforeEach(async() => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{
        useValue: appServiceStub, provide: AppService
      }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should exist', () => {
    expect(appController).toBeTruthy();
  });

  describe('Get all todos', () => {
    it('should call the service to get the todos', () => {
      appController.getAllTodos();

      expect(appServiceStub.getTodos).toHaveBeenCalled();
    });
  });

  describe('Edit todo', () => {
    it('should call the service with the required parameters', () => {
      appController.editTodo({body: {
        todo: {
          status: 0
        }
      }}, {idtodo: 123});

      expect(appServiceStub.editTodo).toHaveBeenCalledWith(123, { _id: expect.any(mongoose.Types.ObjectId), status: 0});
    });
  });

});
