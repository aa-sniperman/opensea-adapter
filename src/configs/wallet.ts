import { ethers } from "ethers";

export function web3Wallet(privateKey: string, provider: ethers.JsonRpcProvider) {
    return new ethers.Wallet(privateKey, provider);
}