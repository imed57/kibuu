import { connectorsForWallets, wallet } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

const baseChain = {
    id: 8453,  // Base mainnet chain ID
    name: 'Base',
    network: 'base',
    nativeCurrency: {
      name: 'Base',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://mainnet.base.org',
    },
    blockExplorers: {
      default: { name: 'BaseScan', url: 'https://basescan.org' },
    },
    testnet: false,
  };

export const { chains, provider, webSocketProvider } = configureChains(
    [chain.mainnet, chain.goerli, chain.rinkeby, chain.kovan, chain.ropsten, baseChain],
    [
        alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
        jsonRpcProvider({ rpc: (chain) => ({ http: chain.rpcUrls.default }) }),
        publicProvider(),
    ],
);

const needsInjectedWalletFallback =
    typeof window !== "undefined" &&
    window.ethereum &&
    !window.ethereum.isMetaMask &&
    !window.ethereum.isCoinbaseWallet;

const connectors = connectorsForWallets([
    {
        groupName: "Popular",
        wallets: [
            wallet.metaMask({ chains, shimDisconnect: true }),
            wallet.brave({ chains, shimDisconnect: true }),
            wallet.rainbow({ chains }),
            wallet.walletConnect({ chains }),
            wallet.coinbase({ appName: "Coinbase", chains }),
            ...(needsInjectedWalletFallback ? [wallet.injected({ chains, shimDisconnect: true })] : []),
        ],
    },
]);

export const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});
