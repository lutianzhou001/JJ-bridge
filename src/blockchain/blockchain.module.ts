import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { BlockchainController } from './blockchain.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blockchain,Account,Transaction } from '../database/database.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Blockchain,Account,Transaction])],
  providers: [BlockchainService],
  controllers: [BlockchainController],
})
export class BlockchainModule {}
