import { Injectable } from '@nestjs/common';
import Web3 from 'web3';
import { default as config } from '../config';
import { ResponseSuccess } from 'src/common/dto/responseSuccess.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { User } from 'src/auth/interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseError } from 'src/common/dto/responseError.dto';
const Roles = require('/Users/lu/Desktop/ningbojj/JJBridge/src/abi/Roles.json');
const Coupons = require('/Users/lu/Desktop/ningbojj/JJBridge/src/abi/Coupons.json');
const JJToken = require('/Users/lu/Desktop/ningbojj/JJBridge/src/abi/JJToken.json');

const CryptoTS = require('crypto-ts');
const RPC_HOST = 'http://47.75.214.198:8502';
const web3 = new Web3(RPC_HOST);

@Injectable()
export class ContractService {

    constructor(@InjectModel('User') private readonly userModel: Model<User>) { }


    async signAndSend(encodedABI: any, privateKey: string, sender: string, contractAddress: string): Promise<any> {
        const signedTx = await web3.eth.accounts.signTransaction(
            {
                data: encodedABI,
                from: sender,
                gas: 300000,
                to: contractAddress,
            },
            privateKey,
        );
        const sendedSignedTransaction = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        return { transactionHash: sendedSignedTransaction.transactionHash, contractAddress: sendedSignedTransaction.contractAddress };
    }

    // 获取私钥
    async getPrivateKeyAndAddress(email: string): Promise<any> {
        // email
        const res = await this.userModel.findOne({ email });
        if (res) {
            // 解密算法在这里，编者注
            const bytes = CryptoTS.AES.decrypt(res.privateKey.toString(), config.aesKey.secret);
            const plaintext = bytes.toString(CryptoTS.enc.Utf8);
            return { privateKey: plaintext, address: res.address };
        } else {
            return new ResponseError('USER_NOT_FOUND');
        }
    }

    // nest we will use rolse.sol
    // so the abi will change to roles

    async appendEnterprise(email: string, address: string, id: string, name: string): Promise<IResponse> {
        const privateKeyAndAddress = await this.getPrivateKeyAndAddress(email);
        const r = new web3.eth.Contract(Roles.abi, config.deployedContracts.RolesAddress) as any;
        const encodedABI = r.methods.appendEnterprise(name, id, address).encodeABI();
        // tslint:disable-next-line:max-line-length
        const res = await this.signAndSend(encodedABI, privateKeyAndAddress.privateKey, privateKeyAndAddress.address, config.deployedContracts.RolesAddress);
        if (res.transactionHash) {
            return new ResponseSuccess('appendEnterpriseSuccess', { transactionHash: res.transactionHash, contractAddress: res.contractAddress });
        }
    }

    async appendStore(email: string, address: string, id: string, name: string) {
        // append(address,id ,name)
        const privateKeyAndAddress = await this.getPrivateKeyAndAddress(email);
        const r = new web3.eth.Contract(Roles.abi, config.deployedContracts.RolesAddress) as any;
        const encodedABI = r.methods.appendStore(name, id, address).encodeABI();
        // tslint:disable-next-line:max-line-length
        const res = await this.signAndSend(encodedABI, privateKeyAndAddress.privateKey, privateKeyAndAddress.address, config.deployedContracts.RolesAddress);
        if (res.transactionHash) {
            return new ResponseSuccess('appendStoreSuccess', { transactionHash: res.transactionHash, contractAddress: res.contractAddress });
        }
    }

    async setAdmin(email: string, adminAddress: string) {
        // use adminAddress
        const privateKeyAndAddress = await this.getPrivateKeyAndAddress(email);
        const r = new web3.eth.Contract(Roles.abi, config.deployedContracts.RolesAddress) as any;
        const encodedABI = r.methods.setAdmin(adminAddress).encodeABI();
        // tslint:disable-next-line:max-line-length
        const res = await this.signAndSend(encodedABI, privateKeyAndAddress.privateKey, privateKeyAndAddress.address, config.deployedContracts.RolesAddress);
        if (res.transactionHash) {
            return new ResponseSuccess('setAdminSuccess', { transactionHash: res.transactionHash, contractAddress: res.contractAddress });
        }
    }

    async updateStore(email: string, address: string, id: string, name: string) {
        // update (address,id,name)
        const privateKeyAndAddress = await this.getPrivateKeyAndAddress(email);
        const r = new web3.eth.Contract(Roles.abi, config.deployedContracts.RolesAddress) as any;
        const encodedABI = r.methods.updateStore(name, id, address).encodeABI();
        // tslint:disable-next-line:max-line-length
        const res = await this.signAndSend(encodedABI, privateKeyAndAddress.privateKey, privateKeyAndAddress.address, config.deployedContracts.RolesAddress);
        if (res.transactionHash) {
            return new ResponseSuccess('updateStoreSuccess', { transactionHash: res.transactionHash, contractAddress: res.contractAddress });
        }
    }

    async updateEnterprise(email: string, address: string, id: string, name: string) {
        // update (address,id,name)
        const privateKeyAndAddress = await this.getPrivateKeyAndAddress(email);
        const r = new web3.eth.Contract(Roles.abi, config.deployedContracts.RolesAddress) as any;
        const encodedABI = r.methods.updateEnterprise(name, id, address).encodeABI();
        // tslint:disable-next-line:max-line-length
        const res = await this.signAndSend(encodedABI, privateKeyAndAddress.privateKey, privateKeyAndAddress.address, config.deployedContracts.RolesAddress);
        if (res.transactionHash) {
            return new ResponseSuccess('updateEnterpriseSuccess', { transactionHash: res.transactionHash, contractAddress: res.contractAddress });
        }
    }


    async deleteStore(email: string, id: string) {
        // delete (id)
        const privateKeyAndAddress = await this.getPrivateKeyAndAddress(email);
        const r = new web3.eth.Contract(Roles.abi, config.deployedContracts.RolesAddress) as any;
        const encodedABI = r.methods.deleteStore(id).encodeABI();
        // tslint:disable-next-line:max-line-length
        const res = await this.signAndSend(encodedABI, privateKeyAndAddress.privateKey, privateKeyAndAddress.address, config.deployedContracts.RolesAddress);
        if (res.transactionHash) {
            return new ResponseSuccess('deleteStoreSuccess', { transactionHash: res.transactionHash, contractAddress: res.contractAddress });
        }
    }

    async deleteEnterprise(email: string, id: string) {
        // delete(id)
        const privateKeyAndAddress = await this.getPrivateKeyAndAddress(email);
        const r = new web3.eth.Contract(Roles.abi, config.deployedContracts.RolesAddress) as any;
        const encodedABI = r.methods.deleteEnterprise(id).encodeABI();
        // tslint:disable-next-line:max-line-length
        const res = await this.signAndSend(encodedABI, privateKeyAndAddress.privateKey, privateKeyAndAddress.address, config.deployedContracts.RolesAddress);
        if (res.transactionHash) {
            return new ResponseSuccess('deleteEnterpriseSuccess', { transactionHash: res.transactionHash, contractAddress: res.contractAddress });
        }
    }

    async setFeeAddress(email: string, feeAddress: string) {
        // feeAddress
        const privateKeyAndAddress = await this.getPrivateKeyAndAddress(email);
        const r = new web3.eth.Contract(Roles.abi, config.deployedContracts.RolesAddress) as any;
        const encodedABI = r.methods.setFeeAddress(feeAddress).encodeABI();
        // tslint:disable-next-line:max-line-length
        const res = await this.signAndSend(encodedABI, privateKeyAndAddress.privateKey, privateKeyAndAddress.address, config.deployedContracts.RolesAddress);
        if (res.transactionHash) {
            return new ResponseSuccess('setFeeAddressSuccess', { transactionHash: res.transactionHash, contractAddress: res.contractAddress });
        }
    }

    // next we will use Couponse
    // so the abi will change to couponse

    async issue(email: string, address: string, amount: number) {
        // issue(address,amount)
        const privateKeyAndAddress = await this.getPrivateKeyAndAddress(email);
        const r = new web3.eth.Contract(Coupons.abi, config.deployedContracts.RolesAddress) as any;
        const encodedABI = r.methods.issue(address, amount).encodeABI();
        // tslint:disable-next-line:max-line-length
        const res = await this.signAndSend(encodedABI, privateKeyAndAddress.privateKey, privateKeyAndAddress.address, config.deployedContracts.RolesAddress);
        if (res.transactionHash) {
            return new ResponseSuccess('issueSuccess', { transactionHash: res.transactionHash, contractAddress: res.contractAddress });
        }
    }

    async mintCoupons(email: string, address: string, amount: number) {
        // mintCoupons(address,number);
        const privateKeyAndAddress = await this.getPrivateKeyAndAddress(email);
        const r = new web3.eth.Contract(Coupons.abi, config.deployedContracts.RolesAddress) as any;
        const encodedABI = r.methods.mint(address, amount).encodeABI();
        // tslint:disable-next-line:max-line-length
        const res = await this.signAndSend(encodedABI, privateKeyAndAddress.privateKey, privateKeyAndAddress.address, config.deployedContracts.RolesAddress);
        if (res.transactionHash) {
            return new ResponseSuccess('mintSuccess', { transactionHash: res.transactionHash, contractAddress: res.contractAddress });
        }
    }

    async burnCoupons(email: string, address: string, amount: number) {
        // burnCoupons(address,amount)
        const privateKeyAndAddress = await this.getPrivateKeyAndAddress(email);
        const r = new web3.eth.Contract(Coupons.abi, config.deployedContracts.RolesAddress) as any;
        const encodedABI = r.methods.burn(address, amount).encodeABI();
        // tslint:disable-next-line:max-line-length
        const res = await this.signAndSend(encodedABI, privateKeyAndAddress.privateKey, privateKeyAndAddress.address, config.deployedContracts.RolesAddress);
        if (res.transactionHash) {
            return new ResponseSuccess('burnCouponsSuccess', { transactionHash: res.transactionHash, contractAddress: res.contractAddress });
        }
    }

    // tslint:disable-next-line:max-line-length
    async couponTransfer(email: string, address: string, amount: number, orderId: string, orderDetailId: string[], orderContent: string, orederDetailContent: string[]) {
        // couponTransfer(address,amount)
        const privateKeyAndAddress = await this.getPrivateKeyAndAddress(email);
        const r = new web3.eth.Contract(Coupons.abi, config.deployedContracts.RolesAddress) as any;
        const encodedABI = r.methods.couponTransfer(email, address, amount, orderId, orderDetailId, orderContent, orederDetailContent).encodeABI();
        // tslint:disable-next-line:max-line-length
        const res = await this.signAndSend(encodedABI, privateKeyAndAddress.privateKey, privateKeyAndAddress.address, config.deployedContracts.RolesAddress);
        if (res.transactionHash) {
            return new ResponseSuccess('couponTransferSuccess', { transactionHash: res.transactionHash, contractAddress: res.contractAddress });
        }
    }

    // tslint:disable-next-line:max-line-length
    async refund(email: string, address: string, amount: number, orderId: string, orderDetailId: string[], orderContent: string, orederDetailContent: string[]) {
        // couponTransfer(address,amount)
        const privateKeyAndAddress = await this.getPrivateKeyAndAddress(email);
        const r = new web3.eth.Contract(Coupons.abi, config.deployedContracts.RolesAddress) as any;
        const encodedABI = r.methods.refund(email, address, amount, orderId, orderDetailId, orderContent, orederDetailContent).encodeABI();
        // tslint:disable-next-line:max-line-length
        const res = await this.signAndSend(encodedABI, privateKeyAndAddress.privateKey, privateKeyAndAddress.address, config.deployedContracts.RolesAddress);
        if (res.transactionHash) {
            return new ResponseSuccess('couponTransferSuccess', { transactionHash: res.transactionHash, contractAddress: res.contractAddress });
        }
    }

    async withdraw(email: string, amount: number) {
        // withdraw(amount)
        const privateKeyAndAddress = await this.getPrivateKeyAndAddress(email);
        const r = new web3.eth.Contract(Coupons.abi, config.deployedContracts.RolesAddress) as any;
        const encodedABI = r.methods.withdraw(amount).encodeABI();
        // tslint:disable-next-line:max-line-length
        const res = await this.signAndSend(encodedABI, privateKeyAndAddress.privateKey, privateKeyAndAddress.address, config.deployedContracts.RolesAddress);
        if (res.transactionHash) {
            return new ResponseSuccess('couponTransferSuccess', { transactionHash: res.transactionHash, contractAddress: res.contractAddress });
        }
    }

    // next we we use jjtokens
    // so the abi will change to be JJToken

    async mintJJToken(email: string, address: string, amount: number) {
        // mintJJToken(address,number)
        const privateKeyAndAddress = await this.getPrivateKeyAndAddress(email);
        const r = new web3.eth.Contract(JJToken.abi, config.deployedContracts.RolesAddress) as any;
        const encodedABI = r.methods.jjMint(address, amount).encodeABI();
        // tslint:disable-next-line:max-line-length
        const res = await this.signAndSend(encodedABI, privateKeyAndAddress.privateKey, privateKeyAndAddress.address, config.deployedContracts.RolesAddress);
        if (res.transactionHash) {
            return new ResponseSuccess('mintJJTokenSuccess', { transactionHash: res.transactionHash, contractAddress: res.contractAddress });
        }
    }

    async burnJJToken(email: string, address: string, amount: number) {
        // burnJJToken (address,amount)
        const privateKeyAndAddress = await this.getPrivateKeyAndAddress(email);
        const r = new web3.eth.Contract(JJToken.abi, config.deployedContracts.RolesAddress) as any;
        const encodedABI = r.methods.jjBurn(address, amount).encodeABI();
        // tslint:disable-next-line:max-line-length
        const res = await this.signAndSend(encodedABI, privateKeyAndAddress.privateKey, privateKeyAndAddress.address, config.deployedContracts.RolesAddress);
        if (res.transactionHash) {
            return new ResponseSuccess('mintJJTokenSuccess', { transactionHash: res.transactionHash, contractAddress: res.contractAddress });
        }
    }

    async jjTransfer(email: string, address: string, amount: number) {
        // jjTransfer(address, amount)
        const privateKeyAndAddress = await this.getPrivateKeyAndAddress(email);
        const r = new web3.eth.Contract(JJToken.abi, config.deployedContracts.RolesAddress) as any;
        const encodedABI = r.methods.jjTransfer(address, amount).encodeABI();
        // tslint:disable-next-line:max-line-length
        const res = await this.signAndSend(encodedABI, privateKeyAndAddress.privateKey, privateKeyAndAddress.address, config.deployedContracts.RolesAddress);
        if (res.transactionHash) {
            return new ResponseSuccess('jjTranssferSuccess', { transactionHash: res.transactionHash, contractAddress: res.contractAddress });
        }
    }

    async getBalance(couponId: string, id: string) {
        // getBalance
    }

    async couponInfo(couponId: string) {
        // couponInfo
    }

}
