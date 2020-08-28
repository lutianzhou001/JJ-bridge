import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AppendStoreDto {

    @ApiProperty({ description: 'email' })
    @IsString()
    readonly email: string;

    @ApiProperty({ description: "商家Id" })
    @IsString()
    readonly storeId: string;

    @ApiProperty({ description: "商家名称" })
    @IsString()
    readonly storeName: string;

    @ApiProperty({ description: "商家地址" })
    @IsString()
    readonly storeAddress: string;

}