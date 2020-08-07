import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { BlockchainController } from './blockchain.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { transactionSchema } from './schemas/transaction.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Transaction', schema: transactionSchema }])],
  providers: [BlockchainService],
  controllers: [BlockchainController],
})
export class BlockchainModule { }
