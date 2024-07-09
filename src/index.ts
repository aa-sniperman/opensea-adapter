import { ethers } from 'ethers';
import { mint1155NFT } from './erc-1155/mint';
import { OpenSeaAdapter } from './opensea-adapter';
import { TokenStandard } from 'opensea-js';
import { provider } from './constants/env';

async function example() {
    const tokenAddress = '0xd1307e82d12eba24e6c08a0d1113e5ce9636f3d9'
    const tokenId = '2';
    const masterPrivateKey = '';
    const buyerPrivateKey = '';
    const masterWallet = new ethers.Wallet(masterPrivateKey, provider);

    mint1155NFT(masterWallet, tokenAddress, tokenId, 1000);
    const tokenStandard = TokenStandard.ERC1155;

    const masterAdapter = new OpenSeaAdapter(masterPrivateKey, tokenStandard);
    const buyerAdapter = new OpenSeaAdapter(buyerPrivateKey, tokenStandard);

    // master list NFT
    await masterAdapter.listNFT(tokenAddress, tokenId);

    // buyer wrap ETH
    await buyerAdapter.wrapETH('0.0001');

    // master fulfill buyer offer
    await masterAdapter.takeOffer(tokenAddress, tokenId);
}

example();