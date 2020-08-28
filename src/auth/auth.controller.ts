import { Controller, Post, HttpStatus, HttpCode, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseError } from '../common/dto/responseError.dto';
import { ResponseSuccess } from '../common/dto/responseSuccess.dto';
import { IResponse } from '../common/interfaces/response.interface';
import { CreateUserDto } from './dto/createuser.dto';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { Login } from './dto/login.dto';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly blockchainService: BlockchainService) { }

    @Post('email/login')
    @HttpCode(HttpStatus.OK)
    public async login(@Body() login: Login): Promise<IResponse> {
        try {
            const response = await this.authService.validateLogin(login.email, login.password);
            return new ResponseSuccess('LOGIN.SUCCESS', response);
        } catch (error) {
            return new ResponseError('LOGIN.ERROR', error);
        }
    }

    @Post('email/register')
    @HttpCode(HttpStatus.OK)
    async register(@Body() createUserDto: CreateUserDto): Promise<any> {
        try {
            // 创建一个新用户
            return await this.authService.createNewUser(createUserDto);
        } catch (err) {
            // tslint:disable-next-line:no-console
            console.log(err);
        }
    }
}