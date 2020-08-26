import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MintCouponsDto {

    @ApiProperty({ name: "发行地址" })
    @IsString()
    readonly address: string;

    @ApiProperty({ name: "发行数量" })
    @IsString()
    readonly amount: number;
}