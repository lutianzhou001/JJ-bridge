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
import { IssueDto } from './dto/issue.dto';
import { BurnJJTokenDto } from './dto/burnJJToken.dto';
import { BurnCouponsDto } from './dto/burnCoupons.dto';
import { MintJJTokenDto } from './dto/mintJJToken.dto';
import { MintCouponsDto } from './dto/mintCoupons.dto';
import { JJTransferDto } from './dto/jjTransfer.dto';
import { CouponTransferDto } from './dto/couponTransfer.dto';
import { RefundDto } from './dto/refund.dto';
import { WithdrawDto } from './dto/withdraw.dto';

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
    async issue(@Body() issueDto: IssueDto) {
        return this.contractService.issue(issueDto.enterpriseAddress, issueDto.amount);
    }

    @Post('/burnJJToken')
    async burnJJToken(@Body() burnJJTokenDto: BurnJJTokenDto) {
        return this.contractService.burnJJToken(burnJJTokenDto.address, burnJJTokenDto.amount);
    }

    @Post('/burnCoupons')
    async burnCoupons(@Body() burnCouponsDto: BurnCouponsDto) {
        return this.contractService.burnCoupons(burnCouponsDto.address, burnCouponsDto.amount);
    }

    @Post('setFeeAddress')
    async setFeeAddress(@Body() setFeeAddressDto: SetFeeAddressDto) {
        return this.contractService.setFeeAddress(setFeeAddressDto.feeAddress);
    }

    @Post('setAdmin')
    async setAdmin(@Body() setAdminDto: SetAdminDto) {
        return this.contractService.setAdmin(setAdminDto.adminAddress);
    }

    @Post('appendStore')
    async appendStore(@Body() appendStoreDto: AppendStoreDto) {
        return this.contractService.appendStore(appendStoreDto.storeAddress, appendStoreDto.storeId, appendStoreDto.storeName);
    }

    @Post('appendEnterprise')
    async appendEnterprise(@Body() appendEnterpriseDto: AppendEnterpriseDto) {
        // tslint:disable-next-line: max-line-length
        return this.contractService.appendEnterprise(appendEnterpriseDto.enterpriseAddress, appendEnterpriseDto.enterpriseId, appendEnterpriseDto.enterpriseName);
    }

    @Post('updateStore')
    async updateStore(@Body() updateStoreDto: UpdateStoreDto) {
        return this.contractService.updateStore(updateStoreDto.storeAddress, updateStoreDto.storeId, updateStoreDto.storeName);
    }

    @Post('updateEnterprise')
    async updateEnterprise(@Body() updateEnterpriseDto: UpdateEnterpriseDto) {
        // tslint:disable-next-line: max-line-length
        return this.contractService.updateEnterprise(updateEnterpriseDto.enterpriseAddress, updateEnterpriseDto.enterpriseId, updateEnterpriseDto.enterpriseName);
    }

    @Post('deleteStore')
    async deleteStore(@Body() deleteStoreDto: DeleteStoreDto) {
        return this.contractService.deleteStore(deleteStoreDto.storeId);
    }

    @Post('deleteEnterprise')
    async deleteEnterprise(@Body() deleteEnterpriseDto: DeleteEnterpriseDto) {
        return this.contractService.deleteEnterprise(deleteEnterpriseDto.enterpriseId);
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

    @Post('mintJJToken')
    async mintJJToken(@Body() mintJJTokenDto: MintJJTokenDto) {
        return this.contractService.mintJJToken(mintJJTokenDto.address, mintJJTokenDto.amount);
    }

    @Post('mintCoupons')
    async mintCoupons(@Body() mintCouponsDto: MintCouponsDto) {
        return this.contractService.mintCoupons(mintCouponsDto.address, mintCouponsDto.amount);
    }

    @Post('jjTranfer')
    async jjTransfer(@Body() jjTransferDto: JJTransferDto) {
        return this.contractService.jjTransfer(jjTransferDto.address, jjTransferDto.amount);
    }

    @Post('couponTransfer')
    async couponTransfer(@Body() couponTransferDto: CouponTransferDto) {
        // tslint:disable-next-line: max-line-length
        return this.contractService.couponTransfer(couponTransferDto.address, couponTransferDto.amount, couponTransferDto.orderId, couponTransferDto.orderDetailId, couponTransferDto.orderContent, couponTransferDto.orderDetailContent);
    }

    @Post('refund')
    async refund(@Body() refundDto: RefundDto) {
        // tslint:disable-next-line: max-line-length
        return this.contractService.refund(refundDto.address, refundDto.amount, refundDto.orderId, refundDto.orderDetailId, refundDto.orderContent, refundDto.orderDetailContent);
    }

    @Post('withdraw')
    async withdraw(@Body() withdrawDto: WithdrawDto) {
        return this.contractService.withdraw(withdrawDto.amount);
    }
}
