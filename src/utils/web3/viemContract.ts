let ALCHEMY_KEY_OP = "your_key_here";
let ALCHEMY_KEY_POLYGON = "your_key_here";
let ALCHEMY_KEY_ARB = "your_key_here";
// let INFURA_KEY_POLYGON = "your_key_here";

import {
  cptPolyAddr,
  cptOpAddr,
  cpMintOp,
  cpContractPolygon,
  cpMinterABI,
  cpMintArb,
  cptArbAddr,
  cptBaseAddr,
  cpMintBase,
  cptABI,
  cpABIPolygon,
  faucetContract,
  faucetABI,
} from "./contracts";

// VIEM PUBLIC CLIENT
import {
  createPublicClient,
  createWalletClient,
  http,
  webSocket,
  formatEther,
} from "viem";
import { polygon, optimism, arbitrum } from "viem/chains";

// base chain
// const base = {
//     id: 8453,
//     name: 'Base Mainnet',
//     network: 'base',
//     nativeCurrency: {
//       decimals: 18,
//       name: 'Ether',
//       symbol: 'ETH',
//     },
//     rpcUrls: {
//       public: { http: ['https://developer-access-mainnet.base.org'] },
//       default: { http: ['https://developer-access-mainnet.base.org'] },
//     },
//     blockExplorers: {
//       etherscan: { name: 'BaseScan', url: 'https://basescan.org' },
//       default: { name: 'BaseScan', url: 'https://basescan.org' },
//     },
//     // contracts: {
//     //   multicall3: {
//     //     address: '0xca11bde05977b3631167028862be2a173976ca11',
//     //     blockCreated: 11_907_934,
//     //   },
//     // },
//   }
import { base } from "./customChains"; // mainnet, arbitrum

/** MOST OF THE CALLS HERE ARE FOR HIGH SPEED WEB SOCKET DEFAULT READS FROM PUBLIC CLIENT **/

// SWITCH TO ALCHEMY RPC
const alchemyAPI_P = ALCHEMY_KEY_POLYGON; // hopefully this is the fix!
const alchemyAPI_OP = ALCHEMY_KEY_OP;
const alchemyAPI_ARB = ALCHEMY_KEY_ARB;
// const infuraAPI = INFURA_KEY_POLYGON;

// using websocket connections to RPC for speed

const alPolWs = webSocket(
  "wss://polygon-mainnet.g.alchemy.com/v2/" + alchemyAPI_P
);
const alOpWs = webSocket("wss://opt-mainnet.g.alchemy.com/v2/" + alchemyAPI_OP);
const alArbWs = webSocket(
  "wss://arb-mainnet.g.alchemy.com/v2/" + alchemyAPI_ARB
);

// fallbacks only, not currently in use
// const alOp = http("https://opt-mainnet.g.alchemy.com/v2/" + alchemyAPI_OP);
// const alPoly = http("https://polygon-mainnet.g.alchemy.com/v2/" + alchemyAPI_P);
// const infPoly = http("https://polygon-mainnet.infura.io/v3/" + infuraAPI);

const baseMainnet = http("https://developer-access-mainnet.base.org");

// const lastChance = http();

// VIEM PUBLIC CLIENTS
export var myClient = createPublicClient({
  chain: polygon,
  transport: alPolWs,
});

export const myOPClient = createPublicClient({
  chain: optimism,
  transport: alOpWs,
});

export const myARBClient = createPublicClient({
  chain: arbitrum,
  transport: alArbWs,
});

export const myBaseClient = createPublicClient({
  chain: base,
  transport: baseMainnet,
});

// VIEM WALLET CLIENT - doesn't really work from here anyway...
export const myWalletClient = createWalletClient({
  chain: polygon,
  transport: alPolWs, // fallback to infura if alchemy fails
});

// EXPORT contract direct calls
export async function checkName(chainId: number): Promise<any> {
  if (chainId === 10) {
    return myOPClient.readContract({
      address: cpMintOp,
      abi: cpABIPolygon,
      functionName: "name",
      args: [],
    });
  } else {
    // polygon / default
    return myClient.readContract({
      address: cpContractPolygon,
      abi: cpABIPolygon,
      functionName: "name",
      args: [],
    });
  }
}

export async function checkSymbol(chainId: number): Promise<any> {
  // should be the same name for all chains, os ameyeb just choose the fastest
  if (chainId === 10) {
    return myOPClient.readContract({
      address: cpMintOp,
      abi: cpABIPolygon,
      functionName: "symbol",
      args: [],
    });
  } else {
    return myClient.readContract({
      address: cpContractPolygon,
      abi: cpABIPolygon,
      functionName: "symbol",
      args: [],
    });
  }
}

// OK Polygon, OK OPTIMISM, OK Arbitrum, OK Base
export async function checkCount(chainId: number): Promise<any> {
  // return number of hands deployed in the mint contract
  if (chainId === 8453) {
    return myBaseClient.readContract({
      address: cpMintBase,
      abi: cpMinterABI,
      functionName: "count",
      args: [],
    });
  } else if (chainId === 137) {
    return myClient.readContract({
      address: cpContractPolygon,
      abi: cpABIPolygon,
      functionName: "count",
      args: [],
    });
  } else if (chainId === 10) {
    return myOPClient.readContract({
      address: cpMintOp,
      abi: cpABIPolygon,
      functionName: "count",
      args: [],
    });
  } else if (chainId === 42161) {
    // arbitrum
    return myARBClient.readContract({
      address: cpMintArb,
      abi: cpMinterABI,
      functionName: "count",
      args: [],
    });
  }
  return 0;

  // total count of all games across all chains?
}

// OK Polygon, OK OPTIMISM, OK Arbitrum, BASE
export async function getURI(
  id: number | string,
  chainId: number
): Promise<any> {
  if (chainId === 8453) {
    return myBaseClient.readContract({
      address: cpMintBase,
      abi: cpMinterABI,
      functionName: "tokenURI",
      args: [id],
    });
  } else if (chainId === 42161) {
    return myARBClient.readContract({
      address: cpMintArb,
      abi: cpMinterABI,
      functionName: "tokenURI",
      args: [id],
    });
  } else if (chainId === 10) {
    return myOPClient.readContract({
      address: cpMintOp,
      abi: cpABIPolygon,
      functionName: "tokenURI",
      args: [id],
    });
  } else {
    return myClient.readContract({
      address: cpContractPolygon,
      abi: cpABIPolygon,
      functionName: "tokenURI",
      args: [id],
    });
  }
}

// OK Polygon, OK OPTIMISM, OK Arbitrum, BASE
export async function getOwner(
  id: number | string,
  chainId: number
): Promise<any> {
  if (chainId === 8453) {
    return myBaseClient.readContract({
      address: cpMintBase,
      abi: cpMinterABI,
      functionName: "ownerOf",
      args: [id],
    });
  } else if (chainId === 42161) {
    return myARBClient.readContract({
      address: cpMintArb,
      abi: cpMinterABI,
      functionName: "ownerOf",
      args: [id],
    });
  } else if (chainId === 10) {
    return myOPClient.readContract({
      address: cpMintOp,
      abi: cpABIPolygon,
      functionName: "ownerOf",
      args: [id],
    });
  } else {
    return myClient.readContract({
      address: cpContractPolygon,
      abi: cpABIPolygon,
      functionName: "ownerOf",
      args: [id],
    });
  }
}

// OK Polygon, OK OPTIMISM, OK Arbitrum, OK Base
export async function getBalance(
  address: `0x${string}`,
  chainId: number
): Promise<any> {
  if (chainId === 8453) {
    return myBaseClient.readContract({
      address: cpMintBase,
      abi: cpMinterABI,
      functionName: "balanceOf",
      args: [address],
    });
  } else if (chainId === 137) {
    return myClient.readContract({
      address: cpContractPolygon,
      abi: cpABIPolygon,
      functionName: "balanceOf",
      args: [address],
    });
  } else if (chainId === 10) {
    return myOPClient.readContract({
      address: cpMintOp,
      abi: cpABIPolygon,
      functionName: "balanceOf",
      args: [address],
    });
  } else if (chainId === 42161) {
    // arbitrum
    return myARBClient.readContract({
      address: cpMintArb,
      abi: cpMinterABI,
      functionName: "balanceOf",
      args: [address],
    });
  }
}

// not really used - limits at contract level and token allocation
export async function getFaucetBalance(): Promise<any> {
  return myClient.readContract({
    address: faucetContract,
    abi: faucetABI,
    functionName: "getBalance",
  });
}

// OK Polygon, OK OPTIMISM, OK Arbitrum, OK Base
export async function getCptBalance(
  address: `0x${string}`,
  chainId: number
): Promise<any> {
  // console.log(chainId);

  if (chainId === 8453) {
    //base mainnet
    return myBaseClient.readContract({
      address: cptBaseAddr,
      abi: cptABI,
      functionName: "balanceOf",
      args: [address],
    });
  } else if (chainId === 137) {
    return myClient.readContract({
      address: cptPolyAddr,
      abi: cptABI,
      functionName: "balanceOf",
      args: [address],
    });
  } else if (chainId === 10) {
    return myOPClient.readContract({
      address: cptOpAddr,
      abi: cptABI,
      functionName: "balanceOf",
      args: [address],
    });
  } else if (chainId === 42161) {
    return myARBClient.readContract({
      address: cptArbAddr,
      abi: cptABI,
      functionName: "balanceOf",
      args: [address],
    });
  }
}

// OK Polygon, OK OPTIMISM, OK Arbitrum, OK Base
export async function getTreasury(chainId: number): Promise<number> {
  let defaultCurrency = "ETH"; // op, arb
  let safeAddress: `0x${string}` = "0xC3DDF7AFDE9Fc8Bec6af792C44dd801534aB1385"; // polygon

  if (chainId === 8453) {
    // BASE
    safeAddress = "0x522d634b6BFfb444FdbCdE5932738995A4cfd1F1"; // this is the TEMP safe address on arbitrum

    let minterBalance = await myBaseClient.getBalance({
      address: cpMintBase,
    });
    let depositBalance = await myBaseClient.getBalance({
      address: safeAddress,
    });

    let gameBalEth = formatEther(minterBalance);
    let depBalEth = formatEther(depositBalance);

    console.log("Game Contract Balance: " + gameBalEth + " " + defaultCurrency);
    console.log(
      "Safe Balance (" +
        defaultCurrency +
        "): " +
        depBalEth +
        " " +
        defaultCurrency
    );

    let totalTreasury = Number(gameBalEth) + Number(depBalEth);

    return await totalTreasury;
  } else if (chainId === 42161) {
    // ARBITRUM
    safeAddress = "0x9d41BC83EF4f9154808F086b0F31eE6DeFd882f5"; // this is the safe address on arbitrum

    let minterBalance = await myARBClient.getBalance({
      address: cpMintArb,
    });
    let depositBalance = await myARBClient.getBalance({
      address: safeAddress,
    });

    let gameBalEth = formatEther(minterBalance);
    let depBalEth = formatEther(depositBalance);

    console.log("Game Contract Balance: " + gameBalEth + " " + defaultCurrency);
    console.log(
      "Safe Balance (" +
        defaultCurrency +
        "): " +
        depBalEth +
        " " +
        defaultCurrency
    );

    let totalTreasury = Number(gameBalEth) + Number(depBalEth);

    return await totalTreasury;
  } else if (chainId === 10) {
    // OPTIMISM
    safeAddress = "0xa9786A0c49993898820f9882364d8bFeFe329e86"; // OP Safe

    let minterBalance = await myOPClient.getBalance({
      address: cpMintOp,
    });
    let depositBalance = await myOPClient.getBalance({
      address: safeAddress,
    });

    let gameBalEth = formatEther(minterBalance);
    let depBalEth = formatEther(depositBalance);

    console.log("Game Contract Balance: " + gameBalEth + " " + defaultCurrency);
    console.log(
      "Safe Balance (" +
        defaultCurrency +
        "): " +
        depBalEth +
        " " +
        defaultCurrency
    );

    let totalTreasury = Number(gameBalEth) + Number(depBalEth);

    return await totalTreasury;
  } else {
    // POLYGON
    defaultCurrency = "MATIC"; // override for polygon
    // let safeAddress = "0xC3DDF7AFDE9Fc8Bec6af792C44dd801534aB1385"; //default

    let minterBalance = await myClient.getBalance({
      address: cpContractPolygon,
    });
    let depositBalance = await myClient.getBalance({
      address: safeAddress,
    });

    let gameBalEth = formatEther(minterBalance);
    let depBalEth = formatEther(depositBalance);

    console.log(
      "Polygon Contract Balance: " + gameBalEth + " " + defaultCurrency
    );
    console.log(
      "Safe Balance (" +
        defaultCurrency +
        "): " +
        depBalEth +
        " " +
        defaultCurrency
    );

    let totalTreasury = Number(gameBalEth) + Number(depBalEth);

    return await totalTreasury;
  }
}
