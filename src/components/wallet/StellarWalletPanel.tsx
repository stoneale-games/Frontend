import { useCallback, useEffect, useState } from "react";
import { Award, ExternalLink, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { FreighterConnect } from "@/components/wallet/FreighterConnect.tsx";
import { useStellarWallet } from "@/store/stellarWalletStore.ts";
import {
    buildStoneTrustlineTx,
    fetchBadges,
    fetchBalances,
    fetchTotalEarned,
    formatStroops,
    fundWithFriendbot,
    stellarConfig,
    submitToHorizon,
    type StellarBalances,
} from "@/lib/stellar.ts";

// Wallet page: XLM / STONE balances, STONE trustline, rewards and badges from Soroban
export function StellarWalletPanel() {
    const { address, signTx } = useStellarWallet();
    const [balances, setBalances] = useState<StellarBalances | null>(null);
    const [earned, setEarned] = useState<bigint | null>(null);
    const [badges, setBadges] = useState<number[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [busy, setBusy] = useState(false);

    const refresh = useCallback(async () => {
        if (!address) return;
        setLoading(true);
        try {
            setBalances(await fetchBalances(address));
            // Contract reads are optional: they only run when the contract ids are configured
            const [total, owned] = await Promise.allSettled([fetchTotalEarned(address), fetchBadges(address)]);
            setEarned(total.status === "fulfilled" ? total.value : null);
            setBadges(owned.status === "fulfilled" ? owned.value : null);
        } catch (err) {
            console.error("Failed to load Stellar account:", err);
            toast.error("Could not load your Stellar account");
        } finally {
            setLoading(false);
        }
    }, [address]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const fund = useCallback(async () => {
        if (!address) return;
        setBusy(true);
        try {
            await fundWithFriendbot(address);
            toast.success("Funded with testnet XLM");
            await refresh();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Funding failed");
        } finally {
            setBusy(false);
        }
    }, [address, refresh]);

    const addTrustline = useCallback(async () => {
        if (!address) return;
        setBusy(true);
        try {
            const xdr = await buildStoneTrustlineTx(address);
            const signed = await signTx(xdr);
            await submitToHorizon(signed);
            toast.success("STONE enabled. You can now receive rewards.");
            await refresh();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not add STONE trustline");
        } finally {
            setBusy(false);
        }
    }, [address, signTx, refresh]);

    if (!address) {
        return (
            <div className="space-y-3">
                <p className="text-muted-foreground">
                    Connect a Stellar wallet to earn STONE rewards and wellness badges.
                </p>
                <FreighterConnect />
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 w-full">
            <FreighterConnect />

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Balances</CardTitle>
                    <Button variant="ghost" size="sm" onClick={refresh} disabled={loading} className="h-8 w-8 p-0">
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                    {balances && !balances.funded ? (
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">This account is not active on Stellar yet.</p>
                            {stellarConfig.network === "TESTNET" && (
                                <Button size="sm" onClick={fund} disabled={busy}>
                                    Fund with testnet XLM
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            <Row label="XLM" value={balances?.xlm ?? "-"} />
                            <Row
                                label="STONE"
                                value={balances?.stone ?? (stellarConfig.stoneIssuer ? "Not enabled" : "-")}
                            />
                            {balances?.funded && balances.stone === null && stellarConfig.stoneIssuer && (
                                <Button size="sm" onClick={addTrustline} disabled={busy} className="gap-2">
                                    <Sparkles className="h-4 w-4" />
                                    Enable STONE rewards
                                </Button>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Wellness Rewards</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Row label="Lifetime STONE earned" value={earned !== null ? formatStroops(earned) : "-"} />
                    <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4" />
                        {badges === null
                            ? "Badges unavailable"
                            : badges.length === 0
                              ? "No badges yet. Complete a wellness session to earn one!"
                              : `${badges.length} badge${badges.length > 1 ? "s" : ""} earned`}
                    </div>
                    <a
                        href={`${stellarConfig.explorerUrl}/account/${address}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary underline"
                    >
                        View on Stellar Expert <ExternalLink className="h-3 w-3" />
                    </a>
                </CardContent>
            </Card>
        </div>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm">{label}</span>
            <span className="text-sm font-mono">{value}</span>
        </div>
    );
}
