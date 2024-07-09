import DockMasterABI from 'root/abis/dockmaster.json';
import { DockMasterByteCode } from '@/constants/contracts';
import { ethers } from 'ethers';
import { masterWallet} from '@/constants/env';


export async function deployNFT() {
    const factory = new ethers.ContractFactory(DockMasterABI, DockMasterByteCode, masterWallet);

    const contract = await factory.deploy('Opensea NFT', 'ONFT', masterWallet.address);

    await contract.deploymentTransaction()?.wait();

    console.log(`Contract deployed at address: ${await contract.getAddress()}`);
}