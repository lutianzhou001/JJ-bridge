import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account,Blockchain,Transaction, Omni } from './database/database.entity';
import { AccountModule } from './account/account.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { OmniModule } from  './omni/omni.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'hudex-database',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [Account, Blockchain, Transaction, Omni],
      synchronize: true,
    }),
    AccountModule,
    BlockchainModule,
    OmniModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
