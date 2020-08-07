import { IsIn, IsEmail, IsPhoneNumber, Min, Max, IsOptional, IsString } from 'class-validator';

export class AccountDeleteDto {
    @IsString()
    readonly id: string;
}
