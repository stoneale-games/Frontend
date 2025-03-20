export const avalanche = {
  id: 43_114,
  name: "Avalanche",
  network: "avalanche",
  nativeCurrency: {
    decimals: 18,
    name: "Avalanche",
    symbol: "AVAX",
  },
  rpcUrls: {
    public: { http: ["https://api.avax.network/ext/bc/C/rpc"] },
    default: { http: ["https://api.avax.network/ext/bc/C/rpc"] },
  },
  blockExplorers: {
    etherscan: { name: "SnowTrace", url: "https://snowtrace.io" },
    default: { name: "SnowTrace", url: "https://snowtrace.io" },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 11_907_934,
    },
  },
};

export const base = {
  id: 8453,
  name: "Base Mainnet",
  network: "base",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://developer-access-mainnet.base.org"] },
    default: { http: ["https://developer-access-mainnet.base.org"] },
  },
  blockExplorers: {
    etherscan: { name: "BaseScan", url: "https://basescan.org" },
    default: { name: "BaseScan", url: "https://basescan.org" },
  },
  // contracts: {
  //   multicall3: {
  //     address: '0xca11bde05977b3631167028862be2a173976ca11',
  //     blockCreated: 11_907_934,
  //   },
  // },
};
