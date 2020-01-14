import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account,Blockchain } from './database/database.entity';
import { AccountModule } from './account/account.module';
import { BlockchainModule } from './blockchain/blockchain.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 13306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [Account, Blockchain],
      synchronize: true,
    }),
    AccountModule,
    BlockchainModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
