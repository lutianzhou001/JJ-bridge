import { Controller, Post, Body } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { GetBlockDto } from './dto/getBlock.dto';
// 总路由
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) { }

  // 注册路由
  @Post('/fetch')
  async fetch() {
    return this.blockchainService.fetch();
  }

  @Post('/getBlockNumber')
  async getBlockNumber() {
    return this.blockchainService.getBlockNumber();
  }

  @Post('/getBlock')
  async getBlock(@Body() getBlockDto: GetBlockDto) {
    return this.blockchainService.getBlock(getBlockDto.blockNumber);
  }
}
