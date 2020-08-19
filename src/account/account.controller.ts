import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountCreateDto } from './dto/account.create.dto';

// 总路由
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Post('/create')
  async create(@Body() accountCreateDto: AccountCreateDto) {
    return this.accountService.create(accountCreateDto);
  }


  // @Delete(':id')
  // async delete(@Param() params) {
  //   return await this.accountService.destroyAccount(params.id);
  // }
}
