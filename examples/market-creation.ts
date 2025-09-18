/**
 * Example: Creating a Prediction Market on PolyPort
 * 
 * This example demonstrates how to create a binary prediction market
 * with initial liquidity using the PolyPort SDK.
 */

import { 
  Connection, 
  PublicKey, 
  Keypair,
  sendAndConfirmTransaction 
} from '@solana/web3.js';
import { PolyPortSDK } from '@polyport/sdk';

async function createPredictionMarket() {
  // Initialize connection to Solana
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  
  // Initialize PolyPort SDK
  const sdk = new PolyPortSDK({
    connection,
    programId: new PublicKey('FT3tQxWs7Z428ALt4EVwyyrKE1DYdsd1kcXWcBuKnmdM'),
    network: 'devnet'
  });

  // Connect wallet (example with keypair, use wallet adapter in production)
  const wallet = Keypair.generate(); // In production, use connected wallet
  
  // Define market parameters
  const marketParams = {
    title: "Will Solana reach $500 by end of 2025?",
    description: "This market resolves to YES if SOL price is >= $500 USD on December 31, 2025 at 23:59 UTC according to CoinGecko.",
    marketType: 'BINARY' as const,
    category: 'CRYPTO',
    tags: ['solana', 'price-prediction', 'crypto'],
    
    // Set cutoff time (when trading stops)
    cutoffTime: new Date('2025-12-31T23:59:00Z'),
    
    // Resolution configuration
    resolutionSource: {
      type: 'PYTH_ORACLE' as const,
      feedId: 'SOL/USD',
      targetPrice: 500,
      comparison: 'GREATER_OR_EQUAL'
    },
    
    // Market parameters
    initialLiquidity: 100, // 100 SOL initial liquidity
    creatorFee: 200, // 2% creator fee (in basis points)
    platformFee: 100, // 1% platform fee (in basis points)
    
    // Optional: Market image
    imageUrl: 'https://example.com/market-image.png',
    
    // Optional: Additional metadata
    metadata: {
      sources: ['https://www.coingecko.com/en/coins/solana'],
      resolutionDetails: 'Uses CoinGecko API for final price determination',
      disputePeriod: 24 * 60 * 60 // 24 hours in seconds
    }
  };

  try {
    console.log('Creating prediction market...');
    
    // Build the transaction
    const transaction = await sdk.createMarket(marketParams);
    
    // Add wallet as fee payer
    transaction.feePayer = wallet.publicKey;
    
    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    
    // Sign and send transaction
    transaction.sign(wallet);
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [wallet],
      {
        commitment: 'confirmed'
      }
    );
    
    console.log('Market created successfully!');
    console.log('Transaction signature:', signature);
    console.log('View on explorer:', `https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    
    // Get the created market ID from transaction logs
    const marketId = await sdk.getMarketIdFromTransaction(signature);
    console.log('Market ID:', marketId);
    
    // Fetch market details
    const market = await sdk.getMarket(marketId);
    console.log('Market details:', market);
    
    return {
      signature,
      marketId,
      market
    };
    
  } catch (error) {
    console.error('Error creating market:', error);
    throw error;
  }
}

// Advanced: Create market with custom oracle
async function createMarketWithCustomOracle() {
  const sdk = new PolyPortSDK({
    connection: new Connection('https://api.devnet.solana.com'),
    programId: new PublicKey('FT3tQxWs7Z428ALt4EVwyyrKE1DYdsd1kcXWcBuKnmdM')
  });

  const marketParams = {
    title: "Will Team A win the championship?",
    marketType: 'BINARY' as const,
    cutoffTime: new Date('2025-12-01T00:00:00Z'),
    
    // Custom oracle configuration
    resolutionSource: {
      type: 'CUSTOM_ORACLE' as const,
      endpoint: 'https://api.sportsoracle.com/results',
      eventId: 'championship_2025_final',
      validators: [
        new PublicKey('Validator1...'),
        new PublicKey('Validator2...'),
        new PublicKey('Validator3...')
      ],
      requiredSignatures: 2 // Need 2 out of 3 validators
    },
    
    initialLiquidity: 500 // 500 SOL
  };

  const transaction = await sdk.createMarket(marketParams);
  return transaction;
}

// Batch market creation
async function createMultipleMarkets() {
  const sdk = new PolyPortSDK({
    connection: new Connection('https://api.devnet.solana.com'),
    programId: new PublicKey('FT3tQxWs7Z428ALt4EVwyyrKE1DYdsd1kcXWcBuKnmdM')
  });

  const markets = [
    {
      title: "Bitcoin above $200k by 2025?",
      resolutionSource: { type: 'PYTH_ORACLE', feedId: 'BTC/USD', targetPrice: 100000 }
    },
    {
      title: "Ethereum above $10k by 2025?", 
      resolutionSource: { type: 'PYTH_ORACLE', feedId: 'ETH/USD', targetPrice: 10000 }
    },
    {
      title: "Solana above $1000 by 2025?",
      resolutionSource: { type: 'PYTH_ORACLE', feedId: 'SOL/USD', targetPrice: 1000 }
    }
  ];

  const transactions = await Promise.all(
    markets.map(m => sdk.createMarket({ 
      ...m, 
      marketType: 'BINARY' as const,
      cutoffTime: new Date('2025-12-31'),
      initialLiquidity: 50 
    }))
  );

  return transactions;
}

// Run the example
if (require.main === module) {
  createPredictionMarket()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

export { createPredictionMarket, createMarketWithCustomOracle, createMultipleMarkets };
