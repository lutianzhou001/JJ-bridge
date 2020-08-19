import { Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { MigrationExecutor } from 'typeorm';

// 总路由
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) { }

  // 注册路由
  @Post('/fetch')
  async fetch() {
    return this.blockchainService.fetch();
  }

  @Post('/migrate')
  async migrate() {
    return this.blockchainService.migrate();
    // return this.blockchainService.migrate();
  }
}
