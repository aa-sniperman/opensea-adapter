import { binanceApiKey, binanceApiSecret } from '@/constants/env';
import Binance from 'binance-api-node';

console.log(binanceApiKey, binanceApiSecret)
export const client = Binance({
    apiKey: binanceApiKey,
    apiSecret: binanceApiSecret
})

export async function binanceWithdraw(asset: string, amount: number, recipient: string) {
    // Check ETH balance
    const accountInfo = await client.accountInfo();
    const balance = accountInfo.balances.find(balance => balance.asset === asset);
    if(!balance) return;
    console.log(`ETH Balance: ${balance.free}`);

    if (parseFloat(balance.free) < amount) {
      throw new Error('Insufficient balance');
    }

    // Withdraw ETH to MetaMask
    const result = await client.withdraw({
      coin: asset,
      address: recipient,
      amount: amount,
      network: 'BASE'
    });

    console.log('Withdrawal successful:', result);
}