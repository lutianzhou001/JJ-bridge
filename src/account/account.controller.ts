import { Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountDto } from './dto/account.dto';

// 总路由
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Get('myAccount')
  async findAll() {
    this.accountService.findAll();
  }

  // 注册路由
  @Post('/apply')
  async apply(): Promise<AccountDto> {
    return this.accountService.apply();
  }

  @Post('/generate')
  async generate() {
    return this.accountService.generate();
  }

  @Delete(':id')
  async delete(@Param() params) {
    return await this.accountService.destroyAccount(params.id);
  }
}
