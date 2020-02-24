import { Module } from '@nestjs/common';
import { OmniService } from './omni.service';
import { OmniController } from './omni.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Omni,Account,Transaction } from '../database/database.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Omni,Account,Transaction])],
  providers: [OmniService],
  controllers: [OmniController],
})
export class OmniModule {}