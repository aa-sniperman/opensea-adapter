import { ethers } from 'ethers';
import { Dockmaster__factory } from 'root/typechain-types'

export async function mintNFT(wallet: ethers.Wallet, nftAddress: string) {

    const nftContract = Dockmaster__factory.connect(nftAddress, wallet);

    const result = await nftContract.mint(wallet.address);

    console.log(result);
}