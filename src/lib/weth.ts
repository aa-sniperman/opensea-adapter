import { Chain } from "opensea-js";
import { getWETHAddress } from "../constants/address";
import { isMainnet } from "../constants/env";
import { Weth__factory } from "root/typechain-types";
import { ethers } from "ethers";

const wethAddress = getWETHAddress(isMainnet ? Chain.Base : Chain.BaseSepolia);

export async function wrapETH(wallet: ethers.Wallet, amount: string) {
    const wethContract = Weth__factory.connect(wethAddress, wallet);

    const result = await wethContract.deposit({value: ethers.parseEther(amount)});
    await result.wait();
    console.log(result);   
}

export async function unwrapETH(wallet: ethers.Wallet, amount: string) {
    const wethContract = Weth__factory.connect(wethAddress, wallet);

    const result = await wethContract.withdraw(amount);
    await result.wait();
    console.log(result);
}