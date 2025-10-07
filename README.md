# PolyPort - Decentralized Prediction Markets Platform

[![Solana](https://img.shields.io/badge/Solana-Mainnet%20Ready-9945FF?style=for-the-badge&logo=solana)](https://solana.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Anchor](https://img.shields.io/badge/Anchor-0.30.1-red?style=for-the-badge)](https://www.anchor-lang.com/)
[![License](https://img.shields.io/badge/License-Proprietary-green?style=for-the-badge)](./LICENSE)

## 🚀 Overview

PolyPort is a next-generation decentralized prediction markets platform built on Solana, offering lightning-fast settlement, automated market making, and seamless user experience. Our platform enables users to trade on the outcome of real-world events with instant finality and minimal fees.

## ✨ Core Features

### High Performance
- ⚡ **Sub-second transactions** on Solana blockchain
- 💰 **Minimal fees** - typically under $0.01 per transaction
- 📈 **High throughput** - capable of handling 65,000+ TPS

### Advanced Market Mechanics
- 🔮 **Binary & categorical markets** for diverse predictions
- 💧 **Automated Market Maker (AMM)** with CPMM algorithm
- 🏛️ **Decentralized oracle integration** for trustless resolution
- 📊 **Real-time price discovery** with continuous liquidity

### User-Centric Design
- 🎯 **Solana Actions & Blinks** integration for seamless sharing
- 👛 **Multi-wallet support** with secure authentication
- 📱 **Mobile-responsive** Progressive Web App (PWA)
- 🔒 **Non-custodial** - users maintain full control

## 🛠 Technical Architecture

### Smart Contracts
- **Program ID**: `FT3tQxWs7Z428ALt4EVwyyrKE1DYdsd1kcXWcBuKnmdM`
- **Framework**: Anchor (Rust)
- **Network**: Solana Mainnet (Live since Q3 2025)

### Tech Stack
```
Blockchain Layer:
├── Solana (High-performance blockchain)
├── Anchor Framework (Smart contract development)
└── Web3.js/Solana-Web3 (Blockchain interaction)

Backend Services:
├── Node.js + TypeScript (API server)
├── Supabase (Database & real-time subscriptions)
├── Inngest (Event-driven automation)
└── Pyth Network (Price feeds)

Frontend:
├── Next.js 15 (React framework)
├── TailwindCSS (Styling)
├── Wallet Adapter (Wallet integration)
└── SWR (Data fetching)
```

## 📚 Documentation

- [Architecture Overview](./docs/architecture.md) - System design and components
- [Smart Contract Documentation](./contracts/README.md) - On-chain program details
- [Integration Guide](./docs/integration.md) - How to integrate with PolyPort
- [API Reference](./docs/api-reference.md) - REST API endpoints

## 🔧 Quick Start

### Prerequisites
- Node.js 18+
- Solana CLI tools
- Rust 1.70+ (for smart contract development)

### Installation
```bash
# Clone the repository
git clone https://github.com/polyport-dev/polyport-showcase.git
cd polyport-showcase

# Install dependencies
npm install

# View example integrations
cd examples
npm run demo
```

## 📊 Platform Statistics (Mainnet - Live Since July 2025)

- **Total Value Locked (TVL)**: $2.8M+ (October 2025)
- **Active Markets**: 150+ live markets
- **Total Markets Created**: 500+ since launch
- **Daily Volume**: $300K+ average
- **Unique Wallets**: 5,000+
- **Settlement Success Rate**: 99.5%
- **Supported Market Types**: Sports (NFL, NBA, Soccer), Crypto Prices, Politics, Entertainment
- **Oracle Sources**: Pyth Network, SportMonks, API-SPORTS (dual consensus)

## 🤝 Integration Examples

### Create a Market
```typescript
import { PolyPortSDK } from '@polyport/sdk';

const sdk = new PolyPortSDK({
  network: 'mainnet-beta',
  rpcUrl: 'YOUR_RPC_URL'
});

// Create a binary prediction market
const market = await sdk.createMarket({
  title: "Will BTC reach $200k by Dec 2025?",
  marketType: 'BINARY',
  cutoffTime: new Date('2025-12-31'),
  resolutionSource: 'PYTH_ORACLE',
  initialLiquidity: 1000 // in SOL
});
```

### Place a Position
```typescript
// Buy YES shares
const position = await sdk.buyShares({
  marketId: 'market_123',
  outcome: 'YES',
  amount: 100, // in SOL
  slippage: 0.01 // 1% slippage tolerance
});
```

## 🎯 Use Cases

- **Sports Betting** - Predict game outcomes, player performance
- **Financial Markets** - Trade on price movements, economic indicators
- **Political Events** - Elections, policy decisions, geopolitical events
- **Entertainment** - Award shows, box office performance
- **Crypto Markets** - Token prices, protocol metrics, DeFi yields

## 🗺 Roadmap

### Q1-Q2 2025 (Completed)
- [x] Smart contract development (Anchor framework)
- [x] Devnet deployment and testing
- [x] Core AMM implementation (CPMM)
- [x] Solana Actions & Blinks integration
- [x] Basic oracle integration (Pyth Network)

### Q3 2025 (Completed)
- [x] Mainnet launch (July 2025)
- [x] Automated settlement system (SportMonks + API-SPORTS)
- [x] Pyth price feed automation
- [x] Worker infrastructure for auto-activation
- [x] Mobile-responsive PWA

### Q4 2025 (Current - October 6th)
- [x] Automated sports settlement with dual-oracle consensus
- [x] Enhanced Pyth settlement with staleness checks
- [ ] Governance token ($PORT) launch
- [ ] Meteora integration for self-funded liquidity
- [ ] Kamino yield integration - 5% APY on deposits (Testing phase)
- [ ] Jupiter swap aggregation - bet with any token (Integration started)
- [ ] 4-way fee distribution system (Implementation in progress)

### Q1 2026 (Planned)
- [ ] Full Meteora pools (YES/wSOL + NO/wSOL)
- [ ] Complete Jupiter integration - USDC/BONK/JUP support
- [ ] Kamino vault optimization
- [ ] Cross-chain bridges (Ethereum, Base)
- [ ] Institutional API & SDK

## 👥 Team

Our team consists of experienced developers and traders from leading DeFi protocols and traditional finance institutions. We combine deep technical expertise with market knowledge to build the future of prediction markets.

## 📬 Contact

- **Website**: [polyport.app](https://polyport.app)
- **Email**: ops@polyport.app
- **Twitter/X**: [@polyport_mart](https://x.com/polyport_mart)
- **Telegram**: [Join our community](https://t.me/polyport_mart)

For partnership inquiries, integration support, or investment opportunities, please reach out to ops@polyport.app.

---

*This repository contains public interfaces and documentation. For access to the full platform SDK and private beta, please contact our team.*

**© 2025 PolyPort. All rights reserved.**
