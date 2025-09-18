/**
 * Example: Trading on PolyPort Markets
 * 
 * This example shows how to buy, sell, and swap shares
 * in PolyPort prediction markets.
 */

import { 
  Connection, 
  PublicKey,
  Transaction 
} from '@solana/web3.js';
import { PolyPortSDK, Market, Position } from '@polyport/sdk';

class PolyPortTrader {
  private sdk: PolyPortSDK;
  private connection: Connection;

  constructor(rpcUrl: string = 'https://api.devnet.solana.com') {
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.sdk = new PolyPortSDK({
      connection: this.connection,
      programId: new PublicKey('FT3tQxWs7Z428ALt4EVwyyrKE1DYdsd1kcXWcBuKnmdM')
    });
  }

  /**
   * Buy shares in a market
   */
  async buyShares(
    marketId: string,
    outcome: 'YES' | 'NO',
    amountSOL: number,
    maxSlippage: number = 0.01
  ): Promise<string> {
    console.log(`Buying ${outcome} shares for ${amountSOL} SOL in market ${marketId}`);
    
    // Get current market state
    const market = await this.sdk.getMarket(marketId);
    
    // Calculate expected shares based on current price
    const expectedShares = this.calculateExpectedShares(market, outcome, amountSOL);
    console.log(`Expected shares: ${expectedShares}`);
    
    // Calculate minimum acceptable shares with slippage
    const minShares = expectedShares * (1 - maxSlippage);
    
    // Build buy transaction
    const transaction = await this.sdk.buyShares({
      marketId,
      outcome,
      amountInSOL: amountSOL,
      minSharesOut: minShares
    });
    
    // Transaction would be signed and sent by the wallet
    console.log('Transaction built successfully');
    return transaction.signatures[0];
  }

  /**
   * Sell shares in a market
   */
  async sellShares(
    marketId: string,
    outcome: 'YES' | 'NO',
    shareAmount: number,
    minSOL: number
  ): Promise<string> {
    console.log(`Selling ${shareAmount} ${outcome} shares from market ${marketId}`);
    
    // Build sell transaction
    const transaction = await this.sdk.sellShares({
      marketId,
      outcome,
      shareAmount,
      minSOLOut: minSOL
    });
    
    console.log('Sell transaction built');
    return transaction.signatures[0];
  }

  /**
   * Swap between YES and NO shares
   */
  async swapShares(
    marketId: string,
    fromOutcome: 'YES' | 'NO',
    amount: number,
    minAmountOut: number
  ): Promise<string> {
    const toOutcome = fromOutcome === 'YES' ? 'NO' : 'YES';
    console.log(`Swapping ${amount} ${fromOutcome} shares for ${toOutcome} shares`);
    
    const transaction = await this.sdk.swap({
      marketId,
      sideIn: fromOutcome,
      amountIn: amount,
      minAmountOut
    });
    
    return transaction.signatures[0];
  }

  /**
   * Add liquidity to a market
   */
  async addLiquidity(
    marketId: string,
    amountSOL: number
  ): Promise<string> {
    console.log(`Adding ${amountSOL} SOL liquidity to market ${marketId}`);
    
    const transaction = await this.sdk.addLiquidity({
      marketId,
      amountSOL
    });
    
    return transaction.signatures[0];
  }

  /**
   * Remove liquidity from a market
   */
  async removeLiquidity(
    marketId: string,
    lpTokenAmount: number
  ): Promise<string> {
    console.log(`Removing ${lpTokenAmount} LP tokens from market ${marketId}`);
    
    const transaction = await this.sdk.removeLiquidity({
      marketId,
      lpTokenAmount
    });
    
    return transaction.signatures[0];
  }

  /**
   * Get user's positions across all markets
   */
  async getUserPositions(userWallet: PublicKey): Promise<Position[]> {
    const positions = await this.sdk.getUserPositions(userWallet);
    
    console.log(`Found ${positions.length} positions for user`);
    positions.forEach(pos => {
      console.log(`Market ${pos.marketId}:`);
      console.log(`  YES shares: ${pos.yesShares}`);
      console.log(`  NO shares: ${pos.noShares}`);
      console.log(`  Value: ${pos.currentValue} SOL`);
    });
    
    return positions;
  }

  /**
   * Calculate profit/loss for a position
   */
  async calculatePnL(
    marketId: string,
    userWallet: PublicKey
  ): Promise<{
    invested: number;
    currentValue: number;
    pnl: number;
    pnlPercent: number;
  }> {
    const position = await this.sdk.getUserPosition(userWallet, marketId);
    const market = await this.sdk.getMarket(marketId);
    
    const invested = position.totalInvested;
    const yesValue = position.yesShares * market.yesPrice;
    const noValue = position.noShares * market.noPrice;
    const currentValue = yesValue + noValue;
    
    const pnl = currentValue - invested;
    const pnlPercent = (pnl / invested) * 100;
    
    console.log(`P&L for market ${marketId}:`);
    console.log(`  Invested: ${invested} SOL`);
    console.log(`  Current Value: ${currentValue} SOL`);
    console.log(`  P&L: ${pnl > 0 ? '+' : ''}${pnl} SOL (${pnlPercent.toFixed(2)}%)`);
    
    return { invested, currentValue, pnl, pnlPercent };
  }

  /**
   * Execute a limit order when price conditions are met
   */
  async placeLimitOrder(
    marketId: string,
    outcome: 'YES' | 'NO',
    targetPrice: number,
    amountSOL: number,
    orderType: 'BUY' | 'SELL'
  ): Promise<void> {
    console.log(`Placing ${orderType} limit order for ${outcome} at ${targetPrice}`);
    
    // Monitor price until target is reached
    const unsubscribe = this.sdk.subscribeToPrices(marketId, async (prices) => {
      const currentPrice = outcome === 'YES' ? prices.yes : prices.no;
      
      if (orderType === 'BUY' && currentPrice <= targetPrice) {
        console.log(`Target buy price reached: ${currentPrice}`);
        await this.buyShares(marketId, outcome, amountSOL);
        unsubscribe();
      } else if (orderType === 'SELL' && currentPrice >= targetPrice) {
        console.log(`Target sell price reached: ${currentPrice}`);
        // Convert SOL amount to shares for selling
        const shares = amountSOL / currentPrice;
        await this.sellShares(marketId, outcome, shares, amountSOL * 0.95);
        unsubscribe();
      }
    });
  }

  /**
   * Calculate expected shares from SOL amount
   */
  private calculateExpectedShares(
    market: Market,
    outcome: 'YES' | 'NO',
    amountSOL: number
  ): number {
    const price = outcome === 'YES' ? market.yesPrice : market.noPrice;
    return amountSOL / price;
  }

  /**
   * Arbitrage between correlated markets
   */
  async findArbitrageOpportunity(
    market1Id: string,
    market2Id: string
  ): Promise<any> {
    const [market1, market2] = await Promise.all([
      this.sdk.getMarket(market1Id),
      this.sdk.getMarket(market2Id)
    ]);
    
    // Check for inverse correlation arbitrage
    // If market1.YES + market2.YES < 1, there's an arbitrage opportunity
    const totalYesPrice = market1.yesPrice + market2.yesPrice;
    const totalNoPrice = market1.noPrice + market2.noPrice;
    
    if (totalYesPrice < 0.98) { // 2% profit margin
      console.log('Arbitrage opportunity found!');
      console.log(`Buy YES in both markets for guaranteed profit`);
      return {
        type: 'BUY_BOTH_YES',
        expectedProfit: (1 - totalYesPrice) * 100
      };
    }
    
    if (totalNoPrice < 0.98) {
      console.log('Arbitrage opportunity found!');
      console.log(`Buy NO in both markets for guaranteed profit`);
      return {
        type: 'BUY_BOTH_NO',
        expectedProfit: (1 - totalNoPrice) * 100
      };
    }
    
    return null;
  }
}

// Example usage
async function main() {
  const trader = new PolyPortTrader();
  
  // Example: Buy YES shares
  await trader.buyShares(
    'market_abc123',
    'YES',
    10, // 10 SOL
    0.02 // 2% max slippage
  );
  
  // Example: Monitor and trade at target price
  await trader.placeLimitOrder(
    'market_xyz789',
    'NO',
    0.3, // Target price: 0.3 SOL per share
    50, // 50 SOL order
    'BUY'
  );
}

export { PolyPortTrader };
