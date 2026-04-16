# CLAWD PFP Generator

Generate custom AI-powered CLAWD lobster PFP images and mint them as permanent ERC-721 NFTs on Ethereum mainnet. No gas needed -- minting is fully sponsored by the server wallet.

## Features

- **AI-Powered PFP Generation**: Describe your CLAWD lobster and get a unique AI-generated PFP image
- **Gasless Minting**: Users pay with CV tokens; the server wallet sponsors all gas costs
- **Time-Locked Collection**: 7-day minting window; after the deadline, the collection is frozen forever
- **Immutable NFTs**: Token URIs are set once and can never be changed
- **Permanent Gallery**: Browse all minted PFPs even after the minting window closes

## Architecture

1. User connects wallet and signs an EIP-191 message to authorize CV spending
2. User enters a prompt, pays CV, and receives a generated PFP image
3. User pays more CV to mint the image as an NFT on Ethereum mainnet
4. Server wallet (relayer) handles IPFS pinning and on-chain minting, paying gas from its own balance

## Smart Contract

**ClawdPFP.sol** (ERC-721):
- `minter` (immutable): Server wallet authorized to call `mint()`
- `mintDeadline` (immutable): Unix timestamp after which `mint()` reverts permanently
- `mint(address to, string tokenURI)`: Minter-only, before deadline
- No admin functions, no upgrade path, no pause -- walkaway safe after deadline

## Development

```bash
yarn chain          # Start local Anvil chain
yarn deploy         # Deploy contracts
yarn start          # Start Next.js frontend
```

## Testing

```bash
cd packages/foundry && forge test
```

## Environment Variables

See `.env.example` for required configuration.
