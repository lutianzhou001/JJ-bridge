import { IsIn, IsEmail, IsPhoneNumber, Min, Max, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AccountCreateDto {
    @IsString()
    @IsIn(['merchant', 'enterprise', 'platform', 'admin'])
    readonly role: string;
    ethAddress: string;
    ethPrivateKey: string;
}
