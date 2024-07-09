import { ethers } from "ethers";

export function networkProvider(baseUrl: string, apiKey: string): ethers.JsonRpcProvider{
    const url = `${baseUrl}/${apiKey}`;
    const provider = new ethers.JsonRpcProvider(url);
    return provider;
}