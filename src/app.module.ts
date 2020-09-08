import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EasyconfigModule } from 'nestjs-easyconfig';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoMongoose, Todo } from 'backend/models/todo.schema';

require('dotenv').config();

console.log("mongodb+srv://" + process.env.DATABASE_USERNAME + ":" + process.env.DATABASE_PASSWORD + "@" + process.env.DATABASE_HOST);

@Module({
  imports: [EasyconfigModule.register({
    path: './.env'
  }),
  MongooseModule.forRoot("mongodb+srv://" + process.env.DATABASE_USERNAME + ":" + process.env.DATABASE_PASSWORD + "@" + process.env.DATABASE_HOST),
  MongooseModule.forFeature([{name: TodoMongoose.name, schema: Todo}]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
