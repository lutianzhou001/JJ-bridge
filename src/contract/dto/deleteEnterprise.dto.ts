import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteEnterpriseDto {

    @ApiProperty({ name: "企业Id" })
    @IsString()
    readonly enterpriseId: string;

}