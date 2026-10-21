# Contributing to the Stoneale Frontend

Thanks for helping build Stoneale on Stellar!

## Picking an issue

1. Browse [open issues](https://github.com/stoneale-games/Frontend/issues). Each one has a complexity label:
   * `complexity: trivial`: copy, styling or a small component. Good for a first contribution.
   * `complexity: medium`: a feature touching a few components, the wallet or the API.
   * `complexity: high`: cross-cutting work such as auth, Soroban transactions or new game flows.
2. Comment on the issue to ask for it to be assigned to you **before** you start.
3. If you've had no activity on an assigned issue for 7 days, it may be reassigned.

## Setup

```bash
npm ci
cp .env.example .env       # fill in the values
npm run dev
```

You'll also need:

* The [Freighter](https://freighter.app) browser extension, switched to **Testnet**.
* Testnet contract IDs from [stoneale-contracts](https://github.com/stoneale-games/stoneale-contracts).

## Before opening a PR

CI runs these checks, so run them locally first:

```bash
npm run lint
npm run build    # runs tsc type-checking and the vite build
```

## Guidelines

* **TypeScript, no `any`** unless it can't be avoided, and then add a comment explaining why.
* Put Stellar and Soroban logic in `src/lib/stellar.ts` and wallet state in `src/store/stellarWalletStore.ts`. Keep components presentational.
* **Never ask the user for a secret key.** All signing goes through Freighter.
* Don't send wellness or mood data on-chain or to third-party services.
* Use the existing UI kit in `src/components/ui` (shadcn/Radix + Tailwind).
* Add screenshots or GIFs to PRs that change the UI.
* Keep PRs focused: one issue per PR, with `Closes #N` in the description.
* Use [Conventional Commits](https://www.conventionalcommits.org): `feat(wallet): ...`, `fix(lobby): ...`.

## License

By contributing, you agree that your contributions will be licensed under [Apache-2.0](LICENSE).
