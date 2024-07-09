import ERC1155ABI from 'root/abis/erc-1155.json';
import { ERC1155ByteCode } from '@/constants/contracts';
import { ethers } from 'ethers';


export async function deploy1155NFT(wallet: ethers.JsonRpcProvider) {
    const factory = new ethers.ContractFactory(ERC1155ABI, ERC1155ByteCode, wallet);

    const contract = await factory.deploy();

    await contract.deploymentTransaction()?.wait();

    console.log(`Contract deployed at address: ${await contract.getAddress()}`);
}