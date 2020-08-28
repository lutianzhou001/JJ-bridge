import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStoreDto {
    @ApiProperty({ name: 'email' })
    @IsString()
    readonly email: string;

    @ApiProperty({ name: "商户Id" })
    @IsString()
    readonly storeId: string;

    @ApiProperty({ name: "商户名称" })
    @IsString()
    readonly storeName: string;

    @ApiProperty({ name: "商户账户地址" })
    @IsString()
    readonly storeAddress: string;

}