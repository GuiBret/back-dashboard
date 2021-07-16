import { Module, HttpModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EasyconfigModule } from 'nestjs-easyconfig';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from '@models/todos/todo.schema';
import { SpotifyController } from './spotify/spotify.controller';
import { SpotifyService } from './spotify/spotify.service';
import { GmailService } from './gmail/gmail.service';
import { GmailController } from './gmail/gmail.controller';
import { SpotifyElementFactory } from './spotify/factories/spotify-element-factory';
import { SpotifyConfigService } from './spotify/services/spotify-config.service';



require('dotenv').config();

@Module({
  imports: [EasyconfigModule.register({
    path: './.env'
  }),
  MongooseModule.forRoot('mongodb+srv://' + process.env.DATABASE_USERNAME + ':' + process.env.DATABASE_PASSWORD + '@' + process.env.DATABASE_HOST),
  MongooseModule.forFeature([{name: Todo.name, schema: TodoSchema}]),
  HttpModule,

  ],
  controllers: [AppController, SpotifyController, GmailController],
  providers: [AppService, SpotifyService, GmailService, SpotifyElementFactory, SpotifyConfigService],
})
export class AppModule {}
