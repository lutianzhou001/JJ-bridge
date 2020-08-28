import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetBlockDto {
    @ApiProperty({ description: '区块Number' })
    @IsString()
    readonly blockNumber: number;
}