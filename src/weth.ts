import { Chain } from "opensea-js";
import { getWETHAddress } from "./constants/address";
import { buyerWallet, isMainnet } from "./constants/env";
import { Weth__factory } from "root/typechain-types";
import { ethers } from "ethers";

const wethAddress = getWETHAddress(isMainnet ? Chain.Base : Chain.BaseSepolia);

const wethContract = Weth__factory.connect(wethAddress, buyerWallet);

export async function wrapETH(amount: string) {
    const result = await wethContract.deposit({value: ethers.parseEther(amount)});
    console.log(result);   
}

