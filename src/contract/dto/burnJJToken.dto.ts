import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BurnJJTokenDto {

    @ApiProperty({ name: "销毁地址" })
    @IsString()
    readonly address: string;

    @ApiProperty({ name: "销毁数量" })
    @IsString()
    readonly amount: number;
}