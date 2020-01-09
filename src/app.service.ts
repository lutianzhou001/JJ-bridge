import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  postSignup(): object {
    return {
    }
  }
  postDestroy(): object {
    return 
  }
  getQuery(): object {
    return
  }
  postInject(): object {
    return
  }
}
