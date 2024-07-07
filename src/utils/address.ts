import { Chain } from "opensea-js";

export const getWETHAddress = (chain: Chain) => {
    switch (chain) {
        case Chain.Mainnet:
            return "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
        case Chain.Polygon:
            return "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
        case Chain.Amoy:
            return "0x52eF3d68BaB452a294342DC3e5f464d7f610f72E";
        case Chain.Sepolia:
            return "0x7b79995e5f793a07bc00c21412e50ecae098e7f9";
        case Chain.Klaytn:
            return "0xfd844c2fca5e595004b17615f891620d1cb9bbb2";
        case Chain.Baobab:
            return "0x9330dd6713c8328a8d82b14e3f60a0f0b4cc7bfb";
        case Chain.Avalanche:
            return "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";
        case Chain.Fuji:
            return "0xd00ae08403B9bbb9124bB305C09058E32C39A48c";
        case Chain.BNB:
            return "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
        case Chain.BNBTestnet:
            return "0xae13d989dac2f0debff460ac112a837c89baa7cd";
        case Chain.Arbitrum:
            return "0x82af49447d8a07e3bd95bd0d56f35241523fbab1";
        case Chain.ArbitrumNova:
            return "0x722e8bdd2ce80a4422e880164f2079488e115365";
        case Chain.ArbitrumSepolia:
            return "0x980b62da83eff3d4576c647993b0c1d7faf17c73";
        case Chain.Blast:
            return "0x4300000000000000000000000000000000000004";
        case Chain.BlastSepolia:
            return "0x4200000000000000000000000000000000000023";
        // OP Chains have WETH at the same address
        case Chain.Base:
        case Chain.BaseSepolia:
        case Chain.Optimism:
        case Chain.OptimismSepolia:
        case Chain.Zora:
        case Chain.ZoraSepolia:
            return "0x4200000000000000000000000000000000000006";
        default:
            throw new Error(`Unknown WETH address for ${chain}`);
    }
};