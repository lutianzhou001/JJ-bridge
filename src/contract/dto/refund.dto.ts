import { IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefundDto {

    @ApiProperty({ name: "转入地址" })
    @IsString()
    readonly address: string;

    @ApiProperty({ name: "转入数量" })
    @IsString()
    readonly amount: number;

    @ApiProperty({ name: "退款订单Id" })
    @IsString()
    readonly orderId: string;

    @ApiProperty({ name: "退款详情Id" })
    @IsArray()
    readonly orderDetailId: string[];

    @ApiProperty({ name: "退款内容" })
    @IsString()
    readonly orderContent: string;

    @ApiProperty({ name: "退款详情内容" })
    @IsArray()
    readonly orderDetailContent: string[];
}



