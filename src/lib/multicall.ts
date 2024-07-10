const MULTICALL_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11'
import { Contract, ethers, Interface } from 'ethers';
import { Dockmaster__factory } from 'root/typechain-types';

// Ethers
export const MULTICALL_ABI_ETHERS = [
    // https://github.com/mds1/multicall
    'function aggregate(tuple(address target, bytes callData)[] calls) payable returns (uint256 blockNumber, bytes[] returnData)',
    'function aggregate3(tuple(address target, bool allowFailure, bytes callData)[] calls) payable returns (tuple(bool success, bytes returnData)[] returnData)',
    'function aggregate3Value(tuple(address target, bool allowFailure, uint256 value, bytes callData)[] calls) payable returns (tuple(bool success, bytes returnData)[] returnData)',
    'function blockAndAggregate(tuple(address target, bytes callData)[] calls) payable returns (uint256 blockNumber, bytes32 blockHash, tuple(bool success, bytes returnData)[] returnData)',
    'function getBasefee() view returns (uint256 basefee)',
    'function getBlockHash(uint256 blockNumber) view returns (bytes32 blockHash)',
    'function getBlockNumber() view returns (uint256 blockNumber)',
    'function getChainId() view returns (uint256 chainid)',
    'function getCurrentBlockCoinbase() view returns (address coinbase)',
    'function getCurrentBlockDifficulty() view returns (uint256 difficulty)',
    'function getCurrentBlockGasLimit() view returns (uint256 gaslimit)',
    'function getCurrentBlockTimestamp() view returns (uint256 timestamp)',
    'function getEthBalance(address addr) view returns (uint256 balance)',
    'function getLastBlockHash() view returns (bytes32 blockHash)',
    'function tryAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) payable returns (tuple(bool success, bytes returnData)[] returnData)',
    'function tryBlockAndAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) payable returns (uint256 blockNumber, bytes32 blockHash, tuple(bool success, bytes returnData)[] returnData)',
];

type Aggregate3Response = { success: boolean; returnData: string };
const MulticallInterface = new Interface(MULTICALL_ABI_ETHERS)
const NFTInterface = Dockmaster__factory.createInterface();

export const ethBalanceCall = (account: string) => {
    return {
        target: MULTICALL_ADDRESS,
        allowFailure: false,
        callData: MulticallInterface.encodeFunctionData("getEthBalance", [account])
    }
}

export const nftBalanceCall = (tokenAddress: string, walletAddress: string) => {
    return {
        target: tokenAddress,
        allowFailure: false,
        callData: NFTInterface.encodeFunctionData("balanceOf", [walletAddress])
    }
}

export const nftOwnershipCall = (tokenAddress: string, tokenId: string) => {
    return {
        target: tokenAddress,
        allowFailure: false,
        callData: NFTInterface.encodeFunctionData("ownerOf", [tokenId])
    }
}

export async function getETHBalanceOfAccounts(provider: ethers.JsonRpcProvider, accounts: string[]) {
    const multicall = new Contract(MULTICALL_ADDRESS, MULTICALL_ABI_ETHERS, provider);

    const results: Aggregate3Response[] = await multicall.aggregate3.staticCall(accounts.map(ethBalanceCall));

    const balances = results.map((result, index) => {
        return {
            account: accounts[index],
            balance: BigInt(MulticallInterface.decodeFunctionResult("getEthBalance", result.returnData)[0])
        }
    })
    return balances
}

export async function getNFTBalanceOfAccounts(provider: ethers.JsonRpcProvider, tokenAddress: string, accounts: string[]) {
    const multicall = new Contract(MULTICALL_ADDRESS, MULTICALL_ABI_ETHERS, provider);

    const results: Aggregate3Response[] = await multicall.aggregate3.staticCall(accounts.map(acc => nftBalanceCall(tokenAddress, acc)));

    const balances = results.map((result, index) => {
        return {
            account: accounts[index],
            balance: BigInt(NFTInterface.decodeFunctionResult("balanceOf", result.returnData)[0])
        }
    })

    return balances;
}

export async function getNFTOwners(provider: ethers.JsonRpcProvider, tokenAddress: string, tokenIds: string[]) {
    const multicall = new Contract(MULTICALL_ADDRESS, MULTICALL_ABI_ETHERS, provider);

    const results: Aggregate3Response[] = await multicall.aggregate3.staticCall(tokenIds.map(id => nftOwnershipCall(tokenAddress, id)));

    const owners = results.map((result, index) => {
        return {
            tokenId: tokenIds[index],
            owner: NFTInterface.decodeFunctionResult("ownerOf", result.returnData)[0]
        }
    })

    return owners;
}