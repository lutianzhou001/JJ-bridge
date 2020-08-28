import { Module } from '@nestjs/common';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/auth/schmeas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [ContractController],
  providers: [ContractService]
})
export class ContractModule { }
