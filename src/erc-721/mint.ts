import { masterWallet } from '@/constants/env';
import { Dockmaster__factory } from 'root/typechain-types'

export async function mintNFT(nftAddress: string) {

    const nftContract = Dockmaster__factory.connect(nftAddress, masterWallet);

    const result = await nftContract.mint(masterWallet.address);

    console.log(result);
}