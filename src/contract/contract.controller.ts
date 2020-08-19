import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ContractService } from './contract.service';
import { AppendStoreDto } from './dto/appendStore.dto';
import { AppendEnterpriseDto } from './dto/appendEnterprise.dto';
import { UpdateEnterpriseDto } from './dto/updateEnterprise.dto';
import { UpdateStoreDto } from './dto/updateStore.dto';
import { DeleteEnterpriseDto } from './dto/deleteEnterprise.dto';
import { DeleteStoreDto } from './dto/deleteStore.dto';
import { SetFeeAddressDto } from './dto/setFeeAddress.dto';
import { SetAdminDto } from './dto/setAdmin.dto';
import { GetBalanceDto } from './dto/getBalance.dto';
import { GetCouponDto } from './dto/getCoupon.dto';

@Controller('contract')
export class ContractController {
    constructor(private readonly contractService: ContractService) { }

    // 管理员相关路由
    // 首次发行
    // 销毁
    // 设置认证商家（增删改）
    // 设置认证商店（增删改）

    // 注册路由
    @Post('/issue')
    async issue() {
        return this.contractService.issue();
    }

    @Post('/burn')
    async burn() {
        return this.contractService.burn();
    }

    @Post('setFeeAddress')
    async setFeeAddress(@Body() setFeeAddressDto: SetFeeAddressDto) {
        return this.contractService.setFeeAddress();
    }

    @Post('setAdmin')
    async setAdmin(@Body() setAdminDto: SetAdminDto) {
        return this.contractService.setAdmin();
    }

    @Post('appendStore')
    async appendStore(@Body() appendStoreDto: AppendStoreDto) {
        return this.contractService.appendStore();
    }

    @Post('appendEnterprise')
    async appendEnterprise(@Body() appendEnterpriseDto: AppendEnterpriseDto) {
        return this.contractService.appendEnterprise();
    }

    @Post('updateStore')
    async updateStore(@Body() updateStoreDto: UpdateStoreDto) {
        return this.contractService.updateStore();
    }

    @Post('updateEnterprise')
    async updateEnterprise(@Body() updateEnterpriseDto: UpdateEnterpriseDto) {
        return this.contractService.updateEnterprise();
    }

    @Post('deleteStore')
    async deleteStore(@Body() deleteStoreDto: DeleteStoreDto) {
        return this.contractService.deleteStore();
    }

    @Post('deleteEnterprise')
    async deleteEnterprise(@Body() deleteEnterpriseDto: DeleteEnterpriseDto) {
        return this.contractService.deleteEnterprise();
    }

    // Coupon通用接口
    @Post('getBalance')
    async getBalance(@Body() getBalanceDto: GetBalanceDto) {
        return this.contractService.getBalance(getBalanceDto.couponId, getBalanceDto.id);
    }

    @Post('couponInfo')
    async couponInfo(@Body() getCouponDto: GetCouponDto) {
        return this.contractService.couponInfo(getCouponDto.couponId);
    }


}
