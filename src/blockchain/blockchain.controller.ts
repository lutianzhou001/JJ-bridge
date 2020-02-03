import { Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';

// 总路由
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  // 注册路由
  @Post('/fetch')
  async fetch() {
      return this.blockchainService.fetch();
  }

  @Post('/collect')
  async collect() {
      return this.blockchainService.collect();
  }

  //@Post('/check')
  //async check() {
  //    return this.blockchainService.check();
  // }

  @Post('/withdraw:value:id:coin_name:address')
  async withdraw(@Param() params) {
    return this.blockchainService.withdraw(params.value, params.id,params.coin_name,params.address);
  }
}
