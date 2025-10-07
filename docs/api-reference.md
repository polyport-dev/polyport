# PolyPort API Reference

## Base URL

```
Production: https://api.polyport.app (Live)
Development: https://api-dev.polyport.app
```

## Authentication

Include your API key in the Authorization header:

```
Authorization: Bearer YOUR_API_KEY
```

## Rate Limits

- Public endpoints: 100 requests/minute
- Authenticated endpoints: 1000 requests/minute

## Endpoints

### Markets

#### GET /markets

Get all markets with optional filters.

**Query Parameters:**
- `status` (string): Filter by status (PENDING, ACTIVE, SETTLED, DISPUTED)
- `category` (string): Filter by category (SPORTS, CRYPTO, POLITICS, etc.)
- `sort` (string): Sort by field (volume, liquidity, created_at)
- `limit` (number): Results per page (default: 20, max: 100)
- `offset` (number): Pagination offset

**Response:**
```json
{
  "markets": [
    {
      "id": "market_123",
      "title": "Will BTC reach $100k?",
      "status": "ACTIVE",
      "yesPrice": 0.65,
      "noPrice": 0.35,
      "volume": 50000,
      "liquidity": 10000,
      "cutoffTime": "2025-12-31T23:59:59Z",
      "createdAt": "2025-08-01T00:00:00Z"
    }
  ],
  "total": 150,
  "hasMore": true
}
```

#### GET /markets/:id

Get detailed market information.

**Response:**
```json
{
  "id": "market_123",
  "title": "Will BTC reach $100k by EOY?",
  "description": "Detailed market description...",
  "status": "ACTIVE",
  "marketType": "BINARY",
  "category": "CRYPTO",
  "tags": ["bitcoin", "price"],
  "creator": "5xV8...9kHJ",
  "yesPrice": 0.65,
  "noPrice": 0.35,
  "yesSupply": 150000,
  "noSupply": 285714,
  "liquidity": 10000,
  "volume": 50000,
  "volumeLast 24h": 5000,
  "trades": 342,
  "uniqueTraders": 89,
  "cutoffTime": "2025-12-31T23:59:59Z",
  "resolutionSource": {
    "type": "PYTH_ORACLE",
    "feedId": "BTC/USD"
  },
  "outcome": null,
  "settledAt": null,
  "createdAt": "2025-08-01T00:00:00Z",
  "updatedAt": "2025-10-07T15:30:00Z"
}
```

### Trading

#### POST /trade/buy

Buy shares in a market.

**Request Body:**
```json
{
  "marketId": "market_123",
  "outcome": "YES",
  "amountSOL": 10,
  "slippageTolerance": 0.01,
  "wallet": "5xV8...9kHJ"
}
```

**Response:**
```json
{
  "transaction": "base64_encoded_transaction",
  "expectedShares": 15.38,
  "estimatedPrice": 0.65,
  "fee": 0.1
}
```

#### POST /trade/sell

Sell shares in a market.

**Request Body:**
```json
{
  "marketId": "market_123",
  "outcome": "YES",
  "shares": 100,
  "minSOLOut": 60,
  "wallet": "5xV8...9kHJ"
}
```

### User Data

#### GET /users/:wallet/positions

Get all positions for a wallet address.

**Response:**
```json
{
  "positions": [
    {
      "marketId": "market_123",
      "marketTitle": "Will BTC reach $100k?",
      "yesShares": 100,
      "noShares": 0,
      "avgBuyPrice": 0.60,
      "currentValue": 65,
      "pnl": 5,
      "pnlPercent": 8.33
    }
  ],
  "totalValue": 650,
  "totalPnL": 50
}
```

#### GET /users/:wallet/history

Get transaction history for a wallet.

**Query Parameters:**
- `type` (string): Filter by type (BUY, SELL, REDEEM)
- `marketId` (string): Filter by market
- `limit` (number): Results per page
- `offset` (number): Pagination offset

### Oracle Data

#### GET /oracle/prices

Get latest oracle prices.

**Query Parameters:**
- `feedIds` (string[]): Comma-separated feed IDs

**Response:**
```json
{
  "prices": {
    "BTC/USD": {
      "price": 95000,
      "confidence": 100,
      "timestamp": "2025-10-07T15:00:00Z"
    }
  }
}
```

### WebSocket API

Connect to real-time updates:

```javascript
const ws = new WebSocket('wss://ws.polyport.app');

// Subscribe to market updates
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'market',
  marketId: 'market_123'
}));

// Receive updates
ws.on('message', (data) => {
  const update = JSON.parse(data);
  console.log('Market update:', update);
});
```

## Error Codes

| Code | Description |
|------|------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid API key |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

## SDK Libraries

Official SDKs available:
- JavaScript/TypeScript: `npm install @polyport/sdk`
- Python: `pip install polyport`
- Rust: `cargo add polyport`

---

For more examples, see [Integration Guide](./integration.md).
