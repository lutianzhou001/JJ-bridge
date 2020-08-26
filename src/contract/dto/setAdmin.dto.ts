import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetAdminDto {

    @ApiProperty({ name: "管理员地址" })
    @IsString()
    readonly adminAddress: string;
}