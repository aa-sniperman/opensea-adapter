import { ethers } from "ethers"
import { EventType, OpenSeaSDK, OrderSide } from "opensea-js";
import { networkProvider, web3Wallet } from "./configs";
import { Chain, TokenStandard } from "opensea-js";
import { getWETHAddress } from "./utils";

export type AdapterParams = {
    privateKey: string,
    baseRpcUrl: string,
    rpcApiKey: string,
    openseaApiKey: string,
    chain: Chain
}

export class OpenSeaAdapter {
    private _provider: ethers.JsonRpcProvider;
    private _openseaSDK: OpenSeaSDK;
    private _wallet: ethers.Wallet;
    private _chain: Chain;

    constructor(params: AdapterParams) {
        this._chain = params.chain
        this._provider = networkProvider(params.baseRpcUrl, params.rpcApiKey);
        this._wallet = web3Wallet(params.privateKey, this._provider);
        this._openseaSDK = new OpenSeaSDK(this._wallet, {
            chain: this._chain,
            apiKey: params.openseaApiKey
        });
    }

    get chain() {
        return this._chain;
    }

    get openseaSDK() {
        return this._openseaSDK
    }

    get provider() {
        return this._provider
    }

    get walletAddress() {
        return this._wallet.address
    }

    async createListing(
        tokenAddress: string,
        tokenId: string,
        startETH: number,
        expirationTime: number,
        paymentTokenAddress: string = getWETHAddress(this._chain),
        englishAuction: boolean = true,

    ) {
        const listing = await this._openseaSDK.createListing({
            asset: {
                tokenAddress,
                tokenId,
                tokenStandard: TokenStandard.ERC721
            },
            accountAddress: this.walletAddress,
            startAmount: startETH,
            expirationTime,
            paymentTokenAddress,
            englishAuction
        })

        return listing;
    }

    async createOffer(tokenAddress: string, tokenId: string, startETH: number) {
        const offer = await this._openseaSDK.createOffer({
            asset: {
                tokenAddress,
                tokenId,
                tokenStandard: TokenStandard.ERC721
            }, accountAddress: this.walletAddress, startAmount: startETH
        })

        return offer
    }

    async fulfillOrder(tokenAddress: string, tokenId: string) {
        const orders = await this.fetchListings(tokenAddress, tokenId);
        const order = orders.at(0);
        if (!order) throw new Error('No order found');
        return await this._openseaSDK.fulfillOrder({ order, accountAddress: this.walletAddress })
    }

    async fetchOrders(tokenAddress: string, tokenId: string) {
        return (await this._openseaSDK.api.getOrders({
            assetContractAddress: tokenAddress,
            tokenId,
            side: OrderSide.OFFER
        })).orders
    }

    async fetchListings(tokenAddress: string, tokenId: string) {
        return (await this._openseaSDK.api.getOrders({
            assetContractAddress: tokenAddress,
            tokenId,
            side: OrderSide.LISTING
        })).orders
    }

    async fetchNFT(tokenAddress: string, tokenId: string) {
        return (await this._openseaSDK.api.getNFT(tokenAddress, tokenId, this._chain)).nft;
    }

    async fetchCollectionNFTs(slug: string) {
        return (await this._openseaSDK.api.getNFTsByCollection(slug)).nfts
    }

    async fetchAccountNFTs() {
        return (await this._openseaSDK.api.getNFTsByAccount(this.walletAddress)).nfts
    }

    async fetchContractNFTs(tokenAddress: string) {
        return (await this._openseaSDK.api.getNFTsByContract(tokenAddress)).nfts
    }

    handleSDKEvents(){
        this._openseaSDK.addListener(EventType.TransactionCreated, ({ transactionHash, event }) => {
            console.info('Transaction created: ', { transactionHash, event })
          })
          this._openseaSDK.addListener(EventType.TransactionConfirmed, ({ transactionHash, event }) => {
            console.info('Transaction confirmed: ',{ transactionHash, event })
          })
          this._openseaSDK.addListener(EventType.TransactionDenied, ({ transactionHash, event }) => {
            console.info('Transaction denied: ',{ transactionHash, event })
          })
          this._openseaSDK.addListener(EventType.TransactionFailed, ({ transactionHash, event }) => {
            console.info('Transaction failed: ',{ transactionHash, event })
          })
          this._openseaSDK.addListener(EventType.WrapEth, ({ accountAddress, amount }) => {
            console.info('Wrap ETH: ',{ accountAddress, amount })
          })
          this._openseaSDK.addListener(EventType.UnwrapWeth, ({ accountAddress, amount }) => {
            console.info('Unwrap ETH: ',{ accountAddress, amount })
          })
          this._openseaSDK.addListener(EventType.MatchOrders, ({ accountAddress }) => {
            console.info('Match orders: ', { accountAddress })
          })
          this._openseaSDK.addListener(EventType.CancelOrder, ({ accountAddress }) => {
            console.info('Cancel order: ', { accountAddress })
          })
    }
}