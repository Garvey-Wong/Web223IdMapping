import { Conflux, format } from 'js-conflux-sdk';
import abiWeb223IdMapping from "../lib/abi/Web223IdMapping.json";

const CONFLUX_RPC_URL = 'https://test.confluxrpc.com'
const CONTRACR_ADDRESS = 'cfxtest:acffgxa8k93xtja66ndwdcjc6v5hn0xy02a4dxw35d'

class ContractWeb223IdMapping {
    async init() {
        const conflux = new Conflux({
            url: CONFLUX_RPC_URL,
            networkId: 1,  // Note: network is required
            logger: console, // for debug
        });
        conflux.provider = window.conflux
        this.conflux = conflux

        const contract = conflux.Contract({
            abi: abiWeb223IdMapping,
            address: CONTRACR_ADDRESS,
        }, conflux)
        this.contract = contract


        const addrs = await window.conflux.request({ method: "cfx_accounts" })
        const addr = addrs[0]
        console.log('connect to fluent. addr = ' + addr);
        this.addr = addr
    }

    async putCode(orgName, hashedCode) {
        return await this.sendTransaction(this.contract.putCode(orgName, hashedCode))
    }

    async putCodes(orgName, hashedCodes) {
        return await this.sendTransaction(this.contract.putCodes(orgName, hashedCodes))
    }

    async memberRegister(orgName, code) {
        return await this.sendTransaction(this.contract.memberRegister(orgName, code))
    }

    async orgRegister(orgName) {
        return await this.sendTransaction(this.contract.orgRegister(orgName))
    }

    async addAdmin(orgName, addr) {
        return await this.sendTransaction(this.contract.addAdmin(orgName, addr))
    }

    async verify(orgName, addr) {
        return await this.contract.verify(orgName, addr).call({ from: this.addr })
    }

    async getManagedOrgNames() {
        return await this.contract.getManagedOrgNames().call({ from: this.addr })
    }

    async getJoinedOrgs() {
        return await this.contract.getJoinedOrgs().call({ from: this.addr })
    }

    async getAllOrgNames() {
        return await this.contract.getAllOrgNames().call({ from: this.addr })
    }

    async getMembers(orgName) {
        return await this.contract.getMembers(orgName).call({ from: this.addr })
    }

    async sendTransaction(methodTx) {
        const estimate = await methodTx.estimateGasAndCollateral({ from: this.addr });
        console.log('estimate', JSON.stringify(estimate, null, 2));

        const receipt = await methodTx.sendTransaction({
            from: this.addr,
            nonce: await this.conflux.getNextNonce(this.addr),
            gas: format.big(estimate.gasUsed).times(1.1).toFixed(0), // you could multiply `gas` like this
            storageLimit: estimate.storageCollateralized,
            gasPrice: 1000000000,
        }).executed();
        console.log('receipt', JSON.stringify(receipt, null, 2));
        console.log(methodTx)

        return this.contract.abi.decodeData(methodTx.data);
    }
}

export default new ContractWeb223IdMapping()