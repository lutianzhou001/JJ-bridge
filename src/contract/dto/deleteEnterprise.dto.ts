import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteEnterpriseDto {

    @ApiProperty({ name: 'email' })
    @IsString()
    readonly email: string;


    @ApiProperty({ name: "企业Id" })
    @IsString()
    readonly enterpriseId: string;

}