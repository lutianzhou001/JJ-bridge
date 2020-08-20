import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { BlockchainController } from './blockchain.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { transactionSchema } from './schemas/transaction.schema';
import { logSchema } from './schemas/log.schema';
import { orderSchema } from './schemas/order.schema';
import { redisProviders } from './redis.providers';

@Module({
  // tslint:disable-next-line: max-line-length
  imports: [MongooseModule.forFeature([{ name: 'Transaction', schema: transactionSchema }, { name: 'Order', schema: orderSchema }, { name: 'Log', schema: logSchema }])],
  providers: [BlockchainService, redisProviders],
  controllers: [BlockchainController],
})
export class BlockchainModule { }
