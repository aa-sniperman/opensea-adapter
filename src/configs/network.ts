import { ethers } from "ethers";

export function networkProvider(url: string): ethers.JsonRpcProvider{
    const provider = new ethers.JsonRpcProvider(url);
    return provider;
}