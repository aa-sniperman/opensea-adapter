import { Chain, OpenSeaSDK, OrderSide, TokenStandard } from "opensea-js";
import { isMainnet, openseaApiKey, provider as defaultProvider } from "../constants/env";
import { ethers } from "ethers";
import { wrapETH as wrapETHFunc } from "./weth";

export class OpenSeaAdapter {
    private _wallet: ethers.Wallet;
    private _sdk: OpenSeaSDK;
    private _tokenStandard: TokenStandard;

    constructor(privateKey: string, tokenStandard: TokenStandard, provider = defaultProvider, sdkApiKey = openseaApiKey) {
        this._tokenStandard = tokenStandard;
        this._wallet = new ethers.Wallet(privateKey, provider);
        this._sdk = new OpenSeaSDK(this._wallet, {
            chain: isMainnet ? Chain.Base : Chain.BaseSepolia,
            apiKey: sdkApiKey
        })
    }

    async nftBalance(tokenAddress: string, tokenId: string) {
        const info = await this._sdk.api.getNFT(tokenAddress, tokenId);
        const balance = info.nft.owners.find(ownership => ownership.address === this._wallet.address.toLocaleLowerCase())?.quantity ?? 0;
        console.log(balance)
        return balance;
    }

    async takeListing(tokenAddress: string, tokenId: string) {
        const order = (await this._sdk.api.getOrders({
            side: OrderSide.LISTING,
            tokenId,
            assetContractAddress: tokenAddress,
            orderBy: 'eth_price',
            orderDirection: 'asc'
        })).orders.at(0);

        if (!order) return;
        const result = await this._sdk.fulfillOrder({ order, accountAddress: this._wallet.address })
        console.log(result);
    }

    async takeOffer(tokenAddress: string, tokenId: string) {
        const order = (await this._sdk.api.getOrders({
            side: OrderSide.OFFER,
            tokenId,
            assetContractAddress: tokenAddress,
            orderBy: 'eth_price',
            orderDirection: 'asc'
        })).orders.at(0);

        if (!order) return;
        console.log(order)
        const result = await this._sdk.fulfillOrder({ order, accountAddress: this._wallet.address })
        console.log(result);
    }

    async listNFT(tokenAddress: string, tokenId: string, startAmount = 0.0003, buyerAddress?: string, quantity?: number) {
        const result = await this._sdk.createListing({
            asset: {
                tokenAddress,
                tokenId,
                tokenStandard: this._tokenStandard
            },
            accountAddress: this._wallet.address,
            startAmount,
            quantity,
            buyerAddress
        })

        console.log(result);

    }

    async makeOffer(tokenAddress: string, tokenId: string, startAmount = 0.0001) {
        const result = await this._sdk.createOffer({
            asset: {
                tokenAddress,
                tokenId,
                tokenStandard: this._tokenStandard
            },
            accountAddress: this._wallet.address,
            startAmount,
        })
        console.log(result);
    }

    async wrapETH(amount: string){
        await wrapETHFunc(this._wallet, amount);
    }
}