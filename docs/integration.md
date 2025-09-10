# PolyPort Integration Guide

## Overview

This guide walks you through integrating PolyPort prediction markets into your application.

## Prerequisites

- Solana wallet (Phantom, Solflare, etc.)
- Node.js 18+ environment
- Basic understanding of Solana transactions

## Installation

```bash
npm install @polyport/sdk @solana/web3.js
```

## Quick Start

### 1. Initialize the SDK

```typescript
import { PolyPortSDK } from '@polyport/sdk';
import { Connection, PublicKey } from '@solana/web3.js';

const connection = new Connection('https://api.mainnet-beta.solana.com');
const sdk = new PolyPortSDK({
  connection,
  programId: new PublicKey('FT3tQxWs7Z428ALt4EVwyyrKE1DYdsd1kcXWcBuKnmdM'),
  network: 'mainnet-beta'
});
```

### 2. Connect Wallet

```typescript
// Using Phantom wallet adapter
const provider = window.solana;
await provider.connect();

sdk.setWallet(provider.publicKey);
```

### 3. Fetch Markets

```typescript
// Get all active markets
const markets = await sdk.getActiveMarkets();

// Get specific market
const market = await sdk.getMarket('market_id_123');

// Get market with real-time updates
const subscription = sdk.subscribeToMarket('market_id_123', (update) => {
  console.log('Market updated:', update);
});
```

## Core Operations

### Creating Markets

```typescript
const createMarketTx = await sdk.createMarket({
  title: "Will ETH reach $10000 by EOY 2025?",
  description: "This market resolves YES if ETH price >= $10000 on Dec 31, 2025",
  marketType: 'BINARY',
  cutoffTime: new Date('2025-12-31T23:59:59Z'),
  resolutionSource: {
    type: 'PYTH_ORACLE',
    feedId: 'ETH/USD'
  },
  initialLiquidity: 1000, // SOL
  creatorFee: 0.02 // 2%
});

const signature = await sdk.sendTransaction(createMarketTx);
```

### Trading

#### Buy Shares
```typescript
const buyTx = await sdk.buyShares({
  marketId: 'market_123',
  outcome: 'YES', // or 'NO'
  amountSOL: 10,
  slippageTolerance: 0.01 // 1%
});

const signature = await sdk.sendTransaction(buyTx);
```

#### Sell Shares
```typescript
const sellTx = await sdk.sellShares({
  marketId: 'market_123',
  outcome: 'YES',
  shares: 100,
  minAmountOut: 9.5 // Minimum SOL to receive
});

const signature = await sdk.sendTransaction(sellTx);
```

### Providing Liquidity

```typescript
const addLiquidityTx = await sdk.addLiquidity({
  marketId: 'market_123',
  amountSOL: 100
});

const signature = await sdk.sendTransaction(addLiquidityTx);
```

### Redeeming Winnings

```typescript
// After market resolution
const redeemTx = await sdk.redeemWinnings({
  marketId: 'market_123'
});

const signature = await sdk.sendTransaction(redeemTx);
```

## Solana Actions Integration

### Creating Blinks

```typescript
import { createAction } from '@polyport/actions';

const action = createAction({
  type: 'market',
  marketId: 'market_123',
  title: 'Predict BTC Price',
  description: 'Will Bitcoin reach $100k?',
  icon: 'https://your-domain.com/icon.png'
});

// Generate shareable link
const blinkUrl = action.toBlink();
```

### Handling Actions

```typescript
// In your API endpoint
export async function POST(req: Request) {
  const { account, signature } = await req.json();
  
  const action = await sdk.parseAction(signature);
  
  const tx = await sdk.executeAction({
    action,
    payer: new PublicKey(account)
  });
  
  return Response.json({
    transaction: tx.serialize()
  });
}
```

## WebSocket Subscriptions

### Real-time Price Updates

```typescript
const priceSubscription = sdk.subscribeToPrices('market_123', (prices) => {
  console.log('YES price:', prices.yes);
  console.log('NO price:', prices.no);
});

// Cleanup
priceSubscription.unsubscribe();
```

### Position Updates

```typescript
const positionSub = sdk.subscribeToPosition(
  wallet.publicKey,
  'market_123',
  (position) => {
    console.log('Your position:', position);
  }
);
```

## Advanced Features

### Batch Operations

```typescript
// Buy shares in multiple markets
const batchTx = await sdk.batchBuy([
  { marketId: 'market_1', outcome: 'YES', amount: 10 },
  { marketId: 'market_2', outcome: 'NO', amount: 5 },
  { marketId: 'market_3', outcome: 'YES', amount: 20 }
]);
```

### Custom Resolution Sources

```typescript
const customMarket = await sdk.createMarket({
  // ... other params
  resolutionSource: {
    type: 'CUSTOM_ORACLE',
    endpoint: 'https://your-oracle.com/api',
    authToken: 'your-auth-token'
  }
});
```

### Governance Participation

```typescript
// Vote on market disputes
const voteTx = await sdk.voteOnDispute({
  marketId: 'disputed_market',
  vote: 'OVERTURN', // or 'UPHOLD'
  reason: 'Oracle data was incorrect'
});
```

## Error Handling

```typescript
try {
  const tx = await sdk.buyShares({
    marketId: 'market_123',
    outcome: 'YES',
    amountSOL: 10
  });
  
  const signature = await sdk.sendTransaction(tx);
  console.log('Success:', signature);
  
} catch (error) {
  if (error.code === 'INSUFFICIENT_LIQUIDITY') {
    console.error('Not enough liquidity in the market');
  } else if (error.code === 'SLIPPAGE_EXCEEDED') {
    console.error('Price moved too much during transaction');
  } else {
    console.error('Transaction failed:', error.message);
  }
}
```

## Testing

### Using Devnet

```typescript
const devnetSdk = new PolyPortSDK({
  connection: new Connection('https://api.devnet.solana.com'),
  programId: new PublicKey('FT3tQxWs7Z428ALt4EVwyyrKE1DYdsd1kcXWcBuKnmdM'),
  network: 'devnet'
});

// Request test SOL
await devnetSdk.requestAirdrop(wallet.publicKey, 10);
```

### Mock Markets

```typescript
// Create test market with instant resolution
const testMarket = await devnetSdk.createTestMarket({
  title: 'Test Market',
  resolveAfter: 60 // seconds
});
```

## Best Practices

1. **Always handle slippage** - Set appropriate tolerance for price movements
2. **Check liquidity** - Verify sufficient liquidity before large trades
3. **Use batch operations** - Combine multiple operations to save on fees
4. **Subscribe to updates** - Use WebSocket for real-time data
5. **Handle errors gracefully** - Provide user-friendly error messages
6. **Test on devnet first** - Always test integration on devnet

## Rate Limits

- Public API: 100 requests/minute
- Authenticated API: 1000 requests/minute
- WebSocket: 10 connections per IP
- Batch operations: Max 10 operations per batch

## Support

- Documentation: [docs.polyport.app](https://docs.polyport.app)
- Discord: [discord.gg/polyport](https://discord.gg/polyport)
- Email: developers@polyport.app

---

For a complete API reference, see [API Documentation](./api-reference.md).
