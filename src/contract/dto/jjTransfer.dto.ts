import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JJTransferDto {

    @ApiProperty({ name: 'email' })
    @IsString()
    readonly email: string;

    @ApiProperty({ name: "转入地址" })
    @IsString()
    readonly address: string;

    @ApiProperty({ name: "转入数量" })
    @IsString()
    readonly amount: number;
}


