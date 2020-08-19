import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetBalanceDto {

    @ApiProperty({ name: "用户Id" })
    @IsString()
    readonly id: string;

    @ApiProperty({ name: "CouponId" })
    @IsString()
    readonly couponId: string;
}
