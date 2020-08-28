import { MinLength, MaxLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Login {
    @ApiProperty({ name: "登录用户email" })
    @IsEmail()
    @ApiProperty()
    readonly email: string;

    @ApiProperty({ name: "登录用户密码" })
    @MinLength(8)
    @MaxLength(20)
    @ApiProperty()
    readonly password: string;
}
