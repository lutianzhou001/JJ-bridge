import { IsString } from 'class-validator';
import { ApiProduces, ApiProperty } from '@nestjs/swagger';

export class SetFeeAddressDto {

    @ApiProperty({ name: "分账地址" })
    @IsString()
    readonly feeAddress: string;

}