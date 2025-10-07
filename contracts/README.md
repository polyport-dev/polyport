# PolyPort Smart Contracts

## Overview

The PolyPort smart contracts are built using the Anchor framework on Solana, providing a secure and efficient prediction markets protocol.

## Program ID
- **Mainnet**: `FT3tQxWs7Z428ALt4EVwyyrKE1DYdsd1kcXWcBuKnmdM` (Live)
- **Devnet**: `FT3tQxWs7Z428ALt4EVwyyrKE1DYdsd1kcXWcBuKnmdM` (Testing)

## Core Components

### Market Structure
```rust
pub struct Market {
    pub market_id: [u8; 16],
    pub creator: Pubkey,
    pub status: MarketStatus,
    pub cutoff_ts: i64,
    pub outcome: Option<Outcome>,
    pub yes_shares_supply: u64,
    pub no_shares_supply: u64,
    pub liquidity_pool: u64,
    pub volume_traded: u64,
    pub fee_bps: u16,
    pub bump: u8,
}
```

### Key Instructions

#### Create Market
```rust
pub fn create_market(
    ctx: Context<CreateMarket>,
    params: CreateMarketParams
) -> Result<()>
```
Creates a new prediction market with initial parameters.

#### Stake (Buy Shares)
```rust
pub fn stake(
    ctx: Context<Stake>,
    side: Side,
    amount: u64
) -> Result<()>
```
Allows users to buy YES or NO shares in a market.

#### Swap
```rust
pub fn swap(
    ctx: Context<Swap>,
    params: SwapParams
) -> Result<()>
```
Enables trading between YES and NO shares using the AMM.

#### Settle Market
```rust
pub fn settle_market(
    ctx: Context<SettleMarket>,
    outcome: Outcome
) -> Result<()>
```
Resolves the market with the final outcome.

#### Redeem Winnings
```rust
pub fn redeem_winner(
    ctx: Context<Redeem>,
    amount: u64
) -> Result<()>
```
Allows winners to claim their payouts after market settlement.

## AMM Implementation

### Constant Product Market Maker (CPMM)

The protocol uses a CPMM formula for price discovery:

```
x * y = k
```

Where:
- `x` = YES share reserves
- `y` = NO share reserves
- `k` = constant product

### Price Calculation

```rust
pub fn calculate_price(
    reserve_in: u64,
    reserve_out: u64,
    amount_in: u64
) -> Result<u64> {
    let k = reserve_in * reserve_out;
    let new_reserve_in = reserve_in + amount_in;
    let new_reserve_out = k / new_reserve_in;
    let amount_out = reserve_out - new_reserve_out;
    
    // Apply fee
    let fee = amount_out * FEE_BPS / 10000;
    Ok(amount_out - fee)
}
```

## Security Features

### Access Control
- Only market creator can settle (for now)
- Time-based restrictions on operations
- Signature verification for oracle data

### Safety Checks
- Integer overflow protection
- Reentrancy guards
- Balance validations
- Slippage protection

## Token Standards

All shares are SPL tokens with:
- 9 decimal places
- Metadata following Metaplex standard
- Burnable for redemption
- Transferable for trading

## Deployment

### Build
```bash
anchor build
```

### Deploy
```bash
anchor deploy --provider.cluster devnet
```

### Verify
```bash
anchor verify FT3tQxWs7Z428ALt4EVwyyrKE1DYdsd1kcXWcBuKnmdM
```

## Testing

Run comprehensive test suite:
```bash
anchor test
```

Individual test files:
```bash
anchor test -- --grep "create market"
anchor test -- --grep "swap shares"
anchor test -- --grep "settlement"
```

## Audit Status

- [x] Internal review completed (Q2 2025)
- [x] External audit completed (Q3 2025)
- [ ] Formal verification (Q1 2026)

## Known Limitations

Current version (v0.1.0):
- Single oracle source per market
- Binary markets only
- Creator-based settlement
- Fixed fee structure

## Current Development (v0.2.0 - Q4 2025)

### In Progress
- Meteora pool integration (CPI for liquidity provision)
- Kamino vault integration (yield generation)
- Jupiter swap routes (multi-token support)
- Enhanced fee distribution (4-way split)

### Completed Features
- Multi-oracle consensus (SportMonks + API-SPORTS)
- Automated settlement with retry logic
- Pyth price feed with staleness checks
- Worker automation system

## Future Upgrades (v0.3.0 - Q1 2026)
- Cross-chain bridges via Wormhole
- Advanced order types (limit, stop-loss)
- Governance token ($PORT) integration
- On-chain DAO voting

## License

Proprietary - All rights reserved

---

For integration examples, see [Integration Guide](../docs/integration.md).
