import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetCouponDto {

    @ApiProperty({ name: "couponID" })
    @IsString()
    readonly couponId: string;

}
