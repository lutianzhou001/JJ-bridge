import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { BlockchainController } from './blockchain.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blockchain } from './blockchain.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Blockchain])],
  providers: [BlockchainService],
  controllers: [BlockchainController],
})
export class BlockchainModule {}
