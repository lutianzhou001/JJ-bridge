import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WithdrawDto {

    @ApiProperty({ description: 'email' })
    @IsString()
    readonly email: string;

    @ApiProperty({ name: '提现数量' })
    @IsString()
    readonly amount: number;
}
