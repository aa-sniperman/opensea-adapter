import { EventType, OpenSeaSDK, OrderSide } from "opensea-js";
import { Chain, TokenStandard } from "opensea-js";
import { getWETHAddress } from "./utils";
export * from './configs'

export async function createListing(
    sdk: OpenSeaSDK,
    accountAddress: string,
    tokenAddress: string,
    tokenId: string,
    startETH: number,
    expirationTime: number,
    paymentTokenAddress: string = getWETHAddress(Chain.Base),
    englishAuction: boolean = true,

) {
    const listing = await sdk.createListing({
        asset: {
            tokenAddress,
            tokenId,
            tokenStandard: TokenStandard.ERC721
        },
        accountAddress,
        startAmount: startETH,
        expirationTime,
        paymentTokenAddress,
        englishAuction
    })

    return listing;
}

export async function createOffer(sdk: OpenSeaSDK, accountAddress: string, tokenAddress: string, tokenId: string, startETH: number) {
    const offer = await sdk.createOffer({
        asset: {
            tokenAddress,
            tokenId,
            tokenStandard: TokenStandard.ERC721
        }, accountAddress,
        startAmount: startETH
    })

    return offer
}

export async function fulfillOrder(sdk: OpenSeaSDK, accountAddress: string, tokenAddress: string, tokenId: string) {
    const orders = await fetchListings(sdk, tokenAddress, tokenId);
    const order = orders.at(0);
    if (!order) throw new Error('No order found');
    return await sdk.fulfillOrder({ order, accountAddress })
}

export async function fetchOrders(sdk: OpenSeaSDK, tokenAddress: string, tokenId: string) {
    return (await sdk.api.getOrders({
        assetContractAddress: tokenAddress,
        tokenId,
        side: OrderSide.OFFER
    })).orders
}

export async function fetchListings(sdk: OpenSeaSDK, tokenAddress: string, tokenId: string) {
    return (await sdk.api.getOrders({
        assetContractAddress: tokenAddress,
        tokenId,
        side: OrderSide.LISTING
    })).orders
}

export async function fetchNFT(sdk: OpenSeaSDK, tokenAddress: string, tokenId: string) {
    return (await sdk.api.getNFT(tokenAddress, tokenId)).nft;
}

export async function fetchCollectionNFTs(sdk: OpenSeaSDK, slug: string) {
    return (await sdk.api.getNFTsByCollection(slug)).nfts
}

export async function fetchAccountNFTs(sdk: OpenSeaSDK, accountAddress: string) {
    return (await sdk.api.getNFTsByAccount(accountAddress)).nfts
}

export async function fetchContractNFTs(sdk: OpenSeaSDK, tokenAddress: string) {
    return (await sdk.api.getNFTsByContract(tokenAddress)).nfts
}

export async function handleSDKEvents(sdk: OpenSeaSDK) {
    sdk.addListener(EventType.TransactionCreated, ({ transactionHash, event }) => {
        console.info('Transaction created: ', { transactionHash, event })
    })
    sdk.addListener(EventType.TransactionConfirmed, ({ transactionHash, event }) => {
        console.info('Transaction confirmed: ', { transactionHash, event })
    })
    sdk.addListener(EventType.TransactionDenied, ({ transactionHash, event }) => {
        console.info('Transaction denied: ', { transactionHash, event })
    })
    sdk.addListener(EventType.TransactionFailed, ({ transactionHash, event }) => {
        console.info('Transaction failed: ', { transactionHash, event })
    })
    sdk.addListener(EventType.WrapEth, ({ accountAddress, amount }) => {
        console.info('Wrap ETH: ', { accountAddress, amount })
    })
    sdk.addListener(EventType.UnwrapWeth, ({ accountAddress, amount }) => {
        console.info('Unwrap ETH: ', { accountAddress, amount })
    })
    sdk.addListener(EventType.MatchOrders, ({ accountAddress }) => {
        console.info('Match orders: ', { accountAddress })
    })
    sdk.addListener(EventType.CancelOrder, ({ accountAddress }) => {
        console.info('Cancel order: ', { accountAddress })
    })
}