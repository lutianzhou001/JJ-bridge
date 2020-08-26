import { Injectable } from '@nestjs/common';

@Injectable()
export class ContractService {

    async getBalance(couponId: string, id: string) {
    }

    async couponInfo(couponId: string) {
    }

    async setFeeAddress(feeAddress: string) {
        // feeAddress
    }

    async setAdmin(adminAddress: string) {
        // use adminAddress
    }

    async issue(address: string, amount: number) {
        // issue(address,amount)
    }

    async burnJJToken(address: string, amount: number) {
        // burnJJToken (address,amount)
    }

    async burnCoupons(address: string, amount: number) {
        // burnCoupons(address,amount)
    }

    async appendStore(address: string, id: string, name: string) {
        // append(address,id ,name)
    }

    async appendEnterprise(address: string, id: string, name: string) {
        // append(address, id , name)
    }

    async updateStore(address: string, id: string, name: string) {
        // update (address,id,name)
    }

    async updateEnterprise(address: string, id: string, name: string) {
        // update (address,id,name)
    }

    async deleteStore(id: string) {
        // delete (id)
    }

    async deleteEnterprise(id: string) {
        // delete(id)
    }

    async mintJJToken(address: string, amount: number) {
        // mintJJToken(address,number)
    }

    async mintCoupons(address: string, amount: number) {
        // mintCoupons(address,number);
    }

    async jjTransfer(address: string, amount: number) {
        // jjTransfer(address, amount)
    }

    // tslint:disable-next-line: max-line-length
    async couponTransfer(address: string, amount: number, orderId: string, orderDetailId: string[], orderContent: string, orederDetailContent: string[]) {
        // couponTransfer(address,amount)
    }

    async refund(address: string, amount: number, orederId: string, orderDetailId: string[], orderContent: string, orederDetailContent: string[]) {
        // couponTransfer(address,amount)
    }

    async withdraw(amount: number) {
        // withdraw(amount)
    }
}
