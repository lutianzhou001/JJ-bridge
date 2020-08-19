import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { ScheduleModule } from '@nestjs/schedule';
import { default as config } from './config';
import { MongooseModule } from '@nestjs/mongoose';
import { ContractModule } from './contract/contract.module';

const userString = config.db.user && config.db.pass ? (config.db.user + ':' + config.db.pass + '@') : '';
const authSource = config.db.authSource ? ('?authSource=' + config.db.authSource + '&w=1') : '';

@Module({
  imports: [ScheduleModule.forRoot(), MongooseModule.forRoot('mongodb://' + userString + config.db.host + ':' + (config.db.port || '27017') + '/' + config.db.database + authSource), AccountModule, BlockchainModule, ContractModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
