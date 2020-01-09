import { Controller, Get, Post, Delete, Param } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from './account.entity';
import { AccountDto } from './dto/account.dto';

// 总路由
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async findAll(): Promise<Account[]> {
    return this.accountService.findAll();
  }

  // 注册路由
  @Post('/signup')
  async signUp(): Promise<AccountDto> {
      return this.accountService.signUp();
  }

  @Delete(':id')
  async delete(@Param() params) {
      return await this.accountService.destroyAccount(params.id);
  }
}
