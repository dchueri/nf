import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from '../config/database.config';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { InvoicesModule } from '../invoices/invoices.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(databaseConfig.uri, {
      connectionFactory: databaseConfig.connectionFactory,
    }),
    AuthModule,
    UsersModule,
    InvoicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
