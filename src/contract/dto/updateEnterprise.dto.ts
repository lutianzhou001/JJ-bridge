import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEnterpriseDto {

    @ApiProperty({ name: 'email' })
    @IsString()
    readonly email: string;

    @ApiProperty({ name: "企业Id" })
    @IsString()
    readonly enterpriseId: string;

    @ApiProperty({ name: "企业名称" })
    @IsString()
    readonly enterpriseName: string;

    @ApiProperty({ name: "企业账户地址" })
    @IsString()
    readonly enterpriseAddress: string;

}