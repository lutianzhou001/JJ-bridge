import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WithdrawDto {

    @ApiProperty({ name: "提现数量" })
    @IsString()
    readonly amount: number;
}
