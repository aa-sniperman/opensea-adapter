import dotenv from 'dotenv';
dotenv.config();
import { networkProvider } from "@/configs";

export const rpcEndpoint = process.env.RPC_ENDPOINT as string;
export const rpcApiKey = process.env.RPC_API_KEY as string;
export const openseaApiKey = process.env.OPENSEA_API_KEY as string;
export const isMainnet = process.env.NETWORK === 'mainnet';
export const binanceApiKey = process.env.BINANCE_API_KEY as string;
export const binanceApiSecret = process.env.BINANCE_API_SECRET as string;

export const provider = networkProvider(rpcEndpoint, rpcApiKey);