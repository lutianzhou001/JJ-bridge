import { IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AppendEnterpriseDto {

    @ApiProperty({ description: "email或者账号" })
    @IsString()
    readonly email: string;

    @ApiProperty({ description: "企业Id" })
    @IsString()
    readonly enterpriseId: string;

    @ApiProperty({ description: "企业名称" })
    @IsString()
    readonly enterpriseName: string;

    @ApiProperty({ description: "企业地址" })
    @IsString()
    readonly enterpriseAddress: string;

}