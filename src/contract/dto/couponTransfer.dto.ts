import { IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CouponTransferDto {
    @ApiProperty({ description: 'email' })
    @IsString()
    readonly email: string;

    @ApiProperty({ name: "转入地址" })
    @IsString()
    readonly address: string;

    @ApiProperty({ name: "转入数量" })
    @IsString()
    readonly amount: number;

    @ApiProperty({ name: "订单Id" })
    @IsString()
    readonly orderId: string;

    @ApiProperty({ name: "订单详情Id" })
    @IsArray()
    readonly orderDetailId: string[];

    @ApiProperty({ name: "订单内容" })
    @IsString()
    readonly orderContent: string;

    @ApiProperty({ name: "订单详情内容" })
    @IsArray()
    readonly orderDetailContent: string[];

}


