import dotenv from 'dotenv';
import { TokenStandard } from 'opensea-js';
import { OpenSeaAdapter } from './opensea-adapter';
dotenv.config();

const tokenAddress = '0xD1307E82D12eBA24e6c08A0d1113e5ce9636F3D9'
const tokenId = '2';

const tokenStandard = TokenStandard.ERC1155;

const privateKey = ''
const adapter = new OpenSeaAdapter(privateKey, tokenStandard);


adapter.listNFT(tokenAddress, tokenId)