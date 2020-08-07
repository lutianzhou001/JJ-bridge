import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { accountSchema } from './schemas/schema.schema.dto';


@Module({
  imports: [MongooseModule.forFeature([{ name: 'Account', schema: accountSchema }])],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule { }
