# PolyPort Architecture Overview

## System Design

PolyPort leverages a microservices architecture optimized for scalability, reliability, and performance.

## Core Components

### 1. Smart Contract Layer (Solana)
```
┌─────────────────────────────────────────┐
│           Solana Blockchain             │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   PolyPort Program (Anchor)     │   │
│  │                                  │   │
│  │  - Market Creation               │   │
│  │  - Order Matching (CPMM)         │   │
│  │  - Settlement Logic              │   │
│  │  - Fee Distribution              │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Key Features:**
- Anchor framework for type-safe smart contracts
- Constant Product Market Maker (CPMM) for liquidity
- On-chain order book with instant settlement
- Multi-sig governance for critical operations

### 2. Backend Services

```
┌──────────────────────────────────────────────┐
│              API Gateway                      │
│         (Next.js API Routes)                  │
└──────────────┬───────────────────────────────┘
               │
    ┌──────────┴──────────┬────────────┐
    │                     │            │
┌───▼────┐         ┌──────▼──────┐  ┌─▼──────────┐
│ Market │         │   Trading   │  │  Oracle    │
│Service │         │   Engine    │  │  Service   │
└────────┘         └─────────────┘  └────────────┘
```

**Services:**
- **Market Service**: Market creation, metadata, lifecycle management
- **Trading Engine**: Order processing, AMM calculations, slippage protection
- **Oracle Service**: Price feeds integration (Pyth, Chainlink), custom oracles

### 3. Data Layer

```
┌─────────────────────────────────────┐
│         Supabase (PostgreSQL)       │
│                                     │
│  Tables:                            │
│  - markets                          │
│  - users                            │
│  - positions                        │
│  - transactions                     │
│  - oracle_feeds                     │
└─────────────────────────────────────┘
```

**Features:**
- Real-time subscriptions for live updates
- Row-level security for data protection
- Automatic backups and point-in-time recovery

### 4. Event Processing

```
┌─────────────────────────────────────┐
│         Inngest (Events)            │
│                                     │
│  Workflows:                         │
│  - Market settlement                │
│  - Position updates                 │
│  - Oracle price updates             │
│  - Notification dispatch            │
└─────────────────────────────────────┘
```

## Data Flow

### Market Creation Flow
```
User → Frontend → API → Smart Contract → Database → Events
                           ↓
                    Token Minting
                           ↓
                    Market Activation
```

### Trading Flow
```
User → Frontend → API → AMM Calculation → Smart Contract
                              ↓
                        Balance Updates
                              ↓
                        Event Emission → Database Update
```

### Settlement Flow
```
Oracle/DAO → Settlement Tx → Smart Contract → Payout Calculation
                                   ↓
                            Winner Redemption
                                   ↓
                            Database Update
```

## Security Architecture

### Multi-Layer Security
1. **Smart Contract Security**
   - Formal verification of critical paths
   - Reentrancy guards
   - Integer overflow protection
   - Access control modifiers

2. **API Security**
   - Rate limiting
   - JWT authentication
   - Request validation
   - CORS policies

3. **Database Security**
   - Row-level security (RLS)
   - Encrypted connections
   - Regular security audits
   - Backup encryption

## Performance Optimization

### Caching Strategy
- **CDN**: Static assets and API responses
- **Redis**: Session data and hot paths
- **In-memory**: Frequently accessed market data

### Scalability
- Horizontal scaling of API servers
- Database read replicas
- Event-driven architecture for async processing
- Optimistic UI updates

## Monitoring & Observability

```
┌─────────────────────────────────────┐
│      Monitoring Stack               │
│                                     │
│  - Metrics (Prometheus)             │
│  - Logs (DataDog)                   │
│  - Traces (OpenTelemetry)           │
│  - Alerts (PagerDuty)               │
└─────────────────────────────────────┘
```

## Deployment Architecture

### Infrastructure
- **Blockchain**: Solana Mainnet/Devnet
- **Backend**: Vercel (Next.js) 
- **Database**: Supabase Cloud
- **CDN**: Cloudflare
- **Monitoring**: DataDog

### CI/CD Pipeline
```
GitHub → Actions → Tests → Build → Deploy
           ↓
      Security Scan
           ↓
      Audit Trail
```

## Current Development (Q4 2025 - October)

### In Active Development
- **Meteora Integration** (70% complete)
  - Self-funded liquidity pools (YES/NO pairs)
  - Automated LP token distribution
  - Fee sharing with market proposers
  
- **Kamino Yield Integration** (Testing phase)
  - 5% APY on idle vault funds
  - Automatic yield distribution to LPs
  - K-token management system

- **Jupiter Swap Aggregation** (40% complete)
  - Multi-token support (USDC, BONK, JUP)
  - Best route finding for token swaps
  - Slippage protection

### Recently Completed (Q3 2025)
- Sports settlement automation with dual-oracle consensus
- Pyth price feed integration with staleness checks
- Worker infrastructure (99.9% uptime)
- Fee claim automation system

## Upcoming (Q1 2026)
- Full Meteora YES/wSOL + NO/wSOL pools
- Complete Jupiter integration 
- Governance token ($PORT) launch
- Cross-chain bridges (Ethereum, Base)
- Institutional trading API

## Technical Decisions

### Why Solana?
- Sub-second block times
- Minimal transaction costs
- High throughput (65,000+ TPS)
- Growing DeFi ecosystem

### Why Anchor?
- Type-safe smart contracts
- Built-in security features
- Excellent developer experience
- Active community support

### Why Supabase?
- Real-time capabilities out of the box
- PostgreSQL reliability
- Built-in auth and RLS
- Excellent developer experience

---

For detailed API documentation, see [API Reference](./api-reference.md).
For smart contract details, see [Contract Documentation](../contracts/README.md).
