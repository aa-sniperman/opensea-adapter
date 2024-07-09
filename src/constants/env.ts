import { networkProvider, web3Wallet } from "@/configs";
import { ethers } from "ethers";
import { Chain, OpenSeaSDK } from "opensea-js";

export const rpcEndpoint = process.env.RPC_ENDPOINT as string;
export const rpcApiKey = process.env.RPC_API_KEY as string;
export const masterPrivateKey = process.env.MASTER_PRIVATE_KEY as string;
export const buyerPrivateKey = process.env.BUYER_PRIVATE_KEY as string;
export const openseaApiKey = process.env.OPENSEA_API_KEY as string;
export const isMainnet = process.env.NETWORK === 'mainnet';

export const provider = networkProvider(rpcEndpoint, rpcApiKey);
export const masterWallet = web3Wallet(masterPrivateKey, provider);
export const buyerWallet = web3Wallet(buyerPrivateKey, provider);

export const openseaSDK = (wallet: ethers.Wallet) => new OpenSeaSDK(wallet, {
    chain: isMainnet ? Chain.Base : Chain.BaseSepolia,
    apiKey: openseaApiKey
})