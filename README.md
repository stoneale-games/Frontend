# 🧠 Stoneale: Fun Meets Mental Wellness

**Stoneale is a play-to-learn mental wellness gaming platform, built on [Stellar](https://stellar.org).**

[![CI](https://github.com/stoneale-games/Frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/stoneale-games/Frontend/actions/workflows/ci.yml)
[![Built on Stellar](https://img.shields.io/badge/built%20on-Stellar-7D00FF)](https://stellar.org)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

Stoneale makes emotional well-being fun, engaging and accessible by blending casual games, community and science-backed wellness experiences. Players earn **STONE**, a Stellar asset, and soulbound **wellness badges**, which are Soroban smart contracts, for building healthy habits.

🌐 **Live demo (Stellar testnet):** https://stoneale-bay.vercel.app

This repo is the web app (React, Vite, TypeScript). The on-chain side lives in **[stoneale-contracts](https://github.com/stoneale-games/stoneale-contracts)**.

## 🌍 Vision

We believe mental health care should be approachable and free of stigma. Stoneale bridges the gap between entertainment and therapy by helping people unwind, connect and heal, one game at a time.

## 🚀 How it works

* 🎮 **Play to heal:** short, interactive games designed to reduce stress and improve mood.
* 💬 **Community vibes:** safe spaces where users can connect and share experiences.
* 🧩 **AI wellness engine:** personalised recommendations for activities, mood boosters and professional help when needed.

## ✨ Why Stellar

| | |
|---|---|
| **Freighter wallet** | Players connect a Stellar wallet with one click. Signing always happens in Freighter, so Stoneale never sees a secret key. |
| **STONE rewards** | In-game rewards are a real Stellar asset, minted by a Soroban contract when you complete wellness achievements. They show up in any Stellar wallet. |
| **Soulbound badges** | Milestones such as "30-day mood streak" are non-transferable NFTs that you own and can delete at any time. |
| **Low fees, fast finality** | Micro-rewards for small habits only make sense when a transaction costs a fraction of a cent and settles in about 5 seconds. |
| **Privacy by design** | Only achievement IDs go on-chain. Mood and journal data never do. |

## 🛠 Getting started

```bash
npm ci
cp .env.example .env   # set the contract IDs from stoneale-contracts
npm run dev
```

1. Install [Freighter](https://freighter.app) and switch it to **Testnet**.
2. Click **Connect Freighter (Stellar)** on the home page.
3. Open **Wallet** in the app to fund your testnet account, enable STONE, and see your rewards and badges.

| Variable | Description |
|---|---|
| `VITE_STELLAR_NETWORK` | `TESTNET` (default) or `PUBLIC` |
| `VITE_STONE_ASSET_ISSUER` | Issuer account of the STONE asset |
| `VITE_STONE_REWARDS_CONTRACT_ID` | `stone-rewards` Soroban contract ID |
| `VITE_WELLNESS_BADGES_CONTRACT_ID` | `wellness-badges` Soroban contract ID |
| `VITE_PROJECT_ID` | Reown/WalletConnect project ID (legacy EVM wallets) |

Stellar code lives in:

* `src/lib/stellar.ts`: network config, Horizon reads, Soroban contract reads, trustline transactions.
* `src/store/stellarWalletStore.ts`: Freighter connection and signing.
* `src/components/wallet/FreighterConnect.tsx` and `StellarWalletPanel.tsx`: the UI.

## 🗺 Roadmap

- [x] **Phase 1, Stellar foundations:** Freighter wallet connect, Stellar balances, STONE trustline, Soroban reward and badge contracts with CI.
- [ ] **Phase 2, Stellar-native accounts:** sign in by having Freighter sign the backend nonce (SEP-10 / SEP-53), retire the EVM wallet flow, and make the game server sign `award` calls automatically.
- [ ] **Phase 3, wellness games and rewards:** breathing, mood check-in and journaling games that pay STONE, plus a badge gallery and profile.
- [ ] **Phase 4, player-owned data:** opt-in, encrypted progress proofs that players can share selectively with therapists or programs.
- [ ] **Phase 5, impact ledger and mainnet:** anonymised on-chain impact metrics, a security audit and mainnet launch.

## 📊 Pitch deck

👉 [View the Stoneale pitch deck](https://docs.google.com/presentation/d/1J0f-8P5qZj87CJiP2Xi2BBjNsSE7f7qAiphvVTM2KOU/edit?slide=id.p#slide=id.p)

## 🤝 Contributing

We welcome contributors! Read [CONTRIBUTING.md](CONTRIBUTING.md) and pick an issue labelled `good first issue`, `complexity: trivial`, `complexity: medium` or `complexity: high`.

## License

[Apache-2.0](LICENSE) © Stoneale

> 🧠 *"The fun side of feeling better."* Stoneale is where play meets purpose: helping the world heal, one game at a time.
