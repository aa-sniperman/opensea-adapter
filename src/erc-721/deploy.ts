import DockMasterABI from 'root/abis/dockmaster.json';
import { DockMasterByteCode } from '@/constants/contracts';
import { ethers } from 'ethers';


export async function deployNFT(wallet: ethers.Wallet) {
    const factory = new ethers.ContractFactory(DockMasterABI, DockMasterByteCode, wallet);

    const contract = await factory.deploy('Opensea NFT', 'ONFT', wallet.address);

    await contract.deploymentTransaction()?.wait();

    console.log(`Contract deployed at address: ${await contract.getAddress()}`);
}