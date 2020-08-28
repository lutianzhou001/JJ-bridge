import {
  Module, MiddlewareConsumer, NestModule, HttpModule,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './passport/jwt.strategy';
import { AuthController } from './auth.controller';
import { UserSchema } from './schmeas/user.schema';
import { JWTService } from './jwt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { logSchema } from '../blockchain/schemas/log.schema';
import { orderSchema } from '../blockchain/schemas/order.schema';
import { transactionSchema } from '../blockchain/schemas/transaction.schema';
import { redisProviders } from '../blockchain/redis.providers';

@Module({
  // tslint:disable-next-line:max-line-length
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, { name: 'Transaction', schema: transactionSchema }, { name: 'Order', schema: orderSchema }, { name: 'Log', schema: logSchema }]), HttpModule],
  controllers: [AuthController],
  providers: [AuthService, JWTService, JwtStrategy, BlockchainService, redisProviders],
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      // .exclude(
      //   { path: 'example', method: RequestMethod.GET },
      // )
      .forRoutes(AuthController);
  }
}