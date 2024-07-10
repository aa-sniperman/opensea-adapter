import dotenv from 'dotenv';
import { getNFTBalanceOfAccounts, getNFTOwners } from './lib/multicall';
import { provider } from './constants/env';
dotenv.config();

async function example() {
    const tokenAddress = '0xa0a8e022b41c8223a939705980df66ee54a254b9'
    const accounts = [
        '0x968eFA0a167d5Fb6AA3700c418fBa9C11D20E1C0',
        '0x449cB8074A242636f5f3e44fbd64cbE3a7D2027F',
    ]

    const balances = await getNFTBalanceOfAccounts(provider, tokenAddress, accounts);
    console.log(balances);

    const tokenIds = Array.from(Array(100).keys()).map(id => (id + 1).toString());
    const owners = await getNFTOwners(provider, tokenAddress, tokenIds);
    console.log(owners);
}

example();