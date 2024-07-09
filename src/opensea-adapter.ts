import { OrderSide, TokenStandard } from "opensea-js";
import { buyerWallet, masterWallet, openseaSDK } from "./constants/env";

const masterSDK = openseaSDK(masterWallet);
const buyerSDK = openseaSDK(buyerWallet);

export class OpenSeaAdapter {
    private _tokenStandard: TokenStandard;

    constructor(tokenStandard: TokenStandard) {
        this._tokenStandard = tokenStandard;
    }

    async nftBalance(owner: string, tokenAddress: string, tokenId: string) {
        const info = await masterSDK.api.getNFT(tokenAddress, tokenId);
        const balance = info.nft.owners.find(ownership => ownership.address === owner.toLowerCase())?.quantity ?? 0;
        console.log(balance)
        return balance;
    }

    async takeListing(tokenAddress: string, tokenId: string) {
        const order = (await buyerSDK.api.getOrders({
            side: OrderSide.LISTING,
            tokenId,
            assetContractAddress: tokenAddress,
            orderBy: 'eth_price',
            orderDirection: 'asc'
        })).orders.at(0);

        if (!order) return;
        const result = await buyerSDK.fulfillOrder({ order, accountAddress: buyerWallet.address })
        console.log(result);
    }

    async takeOffer(tokenAddress: string, tokenId: string) {
        const order = (await masterSDK.api.getOrders({
            side: OrderSide.OFFER,
            tokenId,
            assetContractAddress: tokenAddress,
            orderBy: 'eth_price',
            orderDirection: 'asc'
        })).orders.at(0);

        if (!order) return;
        console.log(order)
        const result = await masterSDK.fulfillOrder({ order, accountAddress: masterWallet.address })
        console.log(result);
    }

    async listNFT(tokenAddress: string, tokenId: string, startAmount = 0.0003) {
        const balance = await this.nftBalance(masterWallet.address, tokenAddress, tokenId);

        const result = await masterSDK.createListing({
            asset: {
                tokenAddress,
                tokenId,
                tokenStandard: this._tokenStandard
            },
            accountAddress: masterWallet.address,
            startAmount,
            quantity: balance,
            buyerAddress: buyerWallet.address
        })

        console.log(result);

    }

    async makeOffer(tokenAddress: string, tokenId: string, startAmount = 0.0001) {
        const result = await buyerSDK.createOffer({
            asset: {
                tokenAddress,
                tokenId,
                tokenStandard: this._tokenStandard
            },
            accountAddress: buyerWallet.address,
            startAmount: 0.0001
        })
        console.log(result);
    }
}