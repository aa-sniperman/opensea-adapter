import { ethers } from 'ethers';
import { Erc1155__factory } from 'root/typechain-types'

export async function mint1155NFT(wallet: ethers.Wallet, nftAddress: string, id: string, amount: number) {

    const nftContract = Erc1155__factory.connect(nftAddress, wallet);

    const result = await nftContract.mint(wallet.address, id, amount, '0x00');

    console.log(result);
}