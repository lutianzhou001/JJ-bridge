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
}
