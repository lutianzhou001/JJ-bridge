import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async findAll() {
    const result = await this.accountRepository.find();
    // tslint:disable-next-line: no-console
    console.log(result);
  }

  async apply(): Promise<Account> {
      const newAccount = new Account();
      newAccount.id = 200;
      newAccount.btcAddress = '0xhdiuafhiagfhiaw';
      newAccount.ethAddress = '0xsdhjaiofhweiofh';
      newAccount.btcPrivateKey = 'aojcsfjhaioehgveuihuhaoubheo';
      newAccount.ethPrivateKey = 'asdafgegageagaefaevfaevgabae';
      try {
        // insert into reepository
        await this.accountRepository.save(newAccount);
        return newAccount;
      } catch (err) {
          return err;
      }
  }

  async destroyAccount(id: number) {
      try {
          const isSuccess = await this.accountRepository.delete(id);
          return isSuccess.affected;
      } catch (err) {
          return err;
      }
  }
}
