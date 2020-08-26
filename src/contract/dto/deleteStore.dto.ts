import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteStoreDto {

    @ApiProperty({ name: "商家Id" })
    @IsString()
    readonly storeId: string;

}