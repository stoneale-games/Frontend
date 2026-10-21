// src/lib/stellar.ts - Stellar network config + read helpers (Horizon & Soroban RPC)
import {
    Account,
    Address,
    Asset,
    BASE_FEE,
    Keypair,
    Contract,
    Networks,
    Operation,
    TransactionBuilder,
    rpc,
    scValToNative,
} from "@stellar/stellar-sdk";

const env = import.meta.env;

export const STELLAR_NETWORK: "TESTNET" | "PUBLIC" =
    env.VITE_STELLAR_NETWORK === "PUBLIC" ? "PUBLIC" : "TESTNET";

export const stellarConfig = {
    network: STELLAR_NETWORK,
    networkPassphrase: STELLAR_NETWORK === "PUBLIC" ? Networks.PUBLIC : Networks.TESTNET,
    horizonUrl:
        env.VITE_STELLAR_HORIZON_URL ??
        (STELLAR_NETWORK === "PUBLIC" ? "https://horizon.stellar.org" : "https://horizon-testnet.stellar.org"),
    rpcUrl:
        env.VITE_STELLAR_RPC_URL ??
        (STELLAR_NETWORK === "PUBLIC" ? "https://mainnet.sorobanrpc.com" : "https://soroban-testnet.stellar.org"),
    stoneIssuer: env.VITE_STONE_ASSET_ISSUER as string | undefined,
    rewardsContractId: env.VITE_STONE_REWARDS_CONTRACT_ID as string | undefined,
    badgesContractId: env.VITE_WELLNESS_BADGES_CONTRACT_ID as string | undefined,
    explorerUrl: `https://stellar.expert/explorer/${STELLAR_NETWORK === "PUBLIC" ? "public" : "testnet"}`,
};

export const STONE_CODE = "STONE";

export const stoneAsset = (): Asset | null =>
    stellarConfig.stoneIssuer ? new Asset(STONE_CODE, stellarConfig.stoneIssuer) : null;

export const shortAddress = (address: string) => `${address.slice(0, 4)}...${address.slice(-4)}`;

export type StellarBalances = {
    funded: boolean;
    xlm: string;
    stone: string | null; // null = no trustline
};

/** Read XLM + STONE balances from Horizon. Unfunded accounts return 404. */
export async function fetchBalances(address: string): Promise<StellarBalances> {
    const res = await fetch(`${stellarConfig.horizonUrl}/accounts/${address}`);
    if (res.status === 404) {
        return { funded: false, xlm: "0", stone: null };
    }
    if (!res.ok) {
        throw new Error(`Horizon error ${res.status}`);
    }
    const account: {
        balances: { asset_type: string; asset_code?: string; asset_issuer?: string; balance: string }[];
    } = await res.json();

    const xlm = account.balances.find((b) => b.asset_type === "native")?.balance ?? "0";
    const stone =
        account.balances.find(
            (b) => b.asset_code === STONE_CODE && b.asset_issuer === stellarConfig.stoneIssuer,
        )?.balance ?? null;

    return { funded: true, xlm, stone };
}

/** Testnet only: fund a new account with Friendbot. */
export async function fundWithFriendbot(address: string) {
    const res = await fetch(`https://friendbot.stellar.org/?addr=${encodeURIComponent(address)}`);
    if (!res.ok) {
        throw new Error("Friendbot funding failed");
    }
}

/** Build an unsigned changeTrust tx so the player can receive STONE. */
export async function buildStoneTrustlineTx(address: string): Promise<string> {
    const asset = stoneAsset();
    if (!asset) {
        throw new Error("VITE_STONE_ASSET_ISSUER is not configured");
    }
    const res = await fetch(`${stellarConfig.horizonUrl}/accounts/${address}`);
    if (!res.ok) {
        throw new Error("Account not found. Fund it with XLM first.");
    }
    const { sequence } = await res.json();

    return new TransactionBuilder(new Account(address, sequence), {
        fee: BASE_FEE,
        networkPassphrase: stellarConfig.networkPassphrase,
    })
        .addOperation(Operation.changeTrust({ asset }))
        .setTimeout(180)
        .build()
        .toXDR();
}

/** Submit a signed classic transaction to Horizon. */
export async function submitToHorizon(signedXdr: string) {
    const body = new URLSearchParams({ tx: signedXdr });
    const res = await fetch(`${stellarConfig.horizonUrl}/transactions`, { method: "POST", body });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.extras?.result_codes?.transaction ?? "Transaction failed");
    }
    return res.json();
}

const rpcServer = () => new rpc.Server(stellarConfig.rpcUrl);

/** Call a read-only Soroban contract function via simulation (no signature needed). */
async function readContract<T>(contractId: string, method: string, ...args: Parameters<Contract["call"]>[1][]) {
    // Simulation needs a source account but never submits, so any valid G-address works.
    const source = new Account(Keypair.random().publicKey(), "0");
    const tx = new TransactionBuilder(source, {
        fee: BASE_FEE,
        networkPassphrase: stellarConfig.networkPassphrase,
    })
        .addOperation(new Contract(contractId).call(method, ...args))
        .setTimeout(30)
        .build();

    const sim = await rpcServer().simulateTransaction(tx);
    if (rpc.Api.isSimulationError(sim)) {
        throw new Error(sim.error);
    }
    return scValToNative(sim.result!.retval) as T;
}

/** Lifetime STONE (in stroops) earned through the stone-rewards contract. */
export async function fetchTotalEarned(address: string): Promise<bigint | null> {
    if (!stellarConfig.rewardsContractId) return null;
    return readContract<bigint>(
        stellarConfig.rewardsContractId,
        "total_earned",
        new Address(address).toScVal(),
    );
}

/** Token ids of the wellness badges owned by `address`. */
export async function fetchBadges(address: string): Promise<number[] | null> {
    if (!stellarConfig.badgesContractId) return null;
    return readContract<number[]>(
        stellarConfig.badgesContractId,
        "badges_of",
        new Address(address).toScVal(),
    );
}

export const formatStroops = (value: bigint) => {
    const whole = value / 10_000_000n;
    const frac = (value % 10_000_000n).toString().padStart(7, "0").replace(/0+$/, "");
    return frac ? `${whole}.${frac}` : whole.toString();
};
