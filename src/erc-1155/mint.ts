import { masterWallet } from '@/constants/env';
import { Dockmaster__factory, Erc1155__factory } from 'root/typechain-types'

export async function mint1155NFT(nftAddress: string, id: string, amount: number) {

    const nftContract = Erc1155__factory.connect(nftAddress, masterWallet);

    const result = await nftContract.mint(masterWallet.address, id, amount, '0x00');

    console.log(result);
}