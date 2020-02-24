import { Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { OmniService } from './omni.service';

// 总路由
@Controller('omni')
export class OmniController {
  constructor(private readonly omniService: OmniService) { }

  // 注册路由
  @Post('/fetch')
  async fetch() {
    return this.omniService.fetch();
  }

  @Post('/collect')
  async collect() {
    return this.omniService.collect();
  }

  //@Post('/check')
  //async check() {
  //    return this.blockchainService.check();
  // }
  @Post('/checktransactionstatus')
  async checktransactionstatus() {
    return this.omniService.checkTransactionStatus();
  }

  @Post('/withdraw/:value/:id/:coin_name/:address')
  async withdraw(@Param() params) {
    return this.omniService.withdraw(params.value, params.id, params.coin_name, params.address);
  }


}