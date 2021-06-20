import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let appController: AppController;
  // tslint:disable-next-line: prefer-const
  let appServiceStub: Partial<AppService>;

  beforeEach(async() => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{
        useValue: appServiceStub, provide: AppService
      }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

});
