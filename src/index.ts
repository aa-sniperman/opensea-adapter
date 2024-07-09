import dotenv from 'dotenv';
dotenv.config();


import { OpenSeaAdapter } from './opensea-adapter';
import { TokenStandard } from 'opensea-js';
import { deploy1155NFT } from './erc-1155/deploy';
import { mint1155NFT } from './erc-1155/mint';
import { masterWallet } from './constants/env';

const erc721Adapter = new OpenSeaAdapter(TokenStandard.ERC721);
const erc1155Adapter = new OpenSeaAdapter(TokenStandard.ERC1155);

///deploy1155NFT();

const tokenAddress = '0xD1307E82D12eBA24e6c08A0d1113e5ce9636F3D9'
// erc1155Adapter.listNFT(tokenAddress, '1', 0.0002)
erc1155Adapter.takeListing(tokenAddress, '1')