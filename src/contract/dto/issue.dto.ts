import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IssueDto {

    @ApiProperty({ name: "企业账户" })
    @IsString()
    readonly enterpriseAddress: string;

    @ApiProperty({ name: "发行资产数量" })
    @IsString()
    readonly amount: number;
}


