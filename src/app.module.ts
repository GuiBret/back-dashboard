import { Module, HttpModule, CacheModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EasyconfigModule } from 'nestjs-easyconfig';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoMongoose, Todo } from '@models/todos/todo.schema';
import { SpotifyController } from './spotify/spotify.controller';
import { SpotifyService } from './spotify/spotify.service';
import { GmailService } from './gmail/gmail.service';
import { GmailController } from './gmail/gmail.controller';

require('dotenv').config();

@Module({
  imports: [
    EasyconfigModule.register({
      path: './.env',
    }),
    //MongooseModule.forRoot("mongodb+srv://" + process.env.DATABASE_USERNAME + ":" + process.env.DATABASE_PASSWORD + "@" + process.env.DATABASE_HOST),
    // MongooseModule.forFeature([{name: TodoMongoose.name, schema: Todo}]),
    HttpModule,
  ],
  controllers: [AppController, SpotifyController, GmailController],
  providers: [AppService, SpotifyService, GmailService],
})
export class AppModule {}
