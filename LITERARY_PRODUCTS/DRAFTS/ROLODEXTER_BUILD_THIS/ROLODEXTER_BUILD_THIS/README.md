# Beacon Platform

A real-time idea marketplace simulation platform where users can mint, trade, and graduate idea NFTs.

## Features

### Core Features
- Real-time idea NFT trading
- Market simulation with dynamic pricing
- Graduation mechanism for successful ideas
- Portfolio management system

### New Features
- Interactive Messenger System
  - Chat with rolodexter AI for market analysis
  - Group chats with other idea creators
  - Real-time market insights
  - Technical analysis visualizations

- Advanced Market Analysis
  - Real-time technical indicators
  - Sentiment analysis
  - Price trend visualization
  - Market momentum tracking
  - Whale activity monitoring

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the simulation:
```bash
.\start-beacon-server.bat
```

Then open your browser to the URL shown in the terminal.

## Backup and Recovery
A backup script is included to save the current state of the simulation:
```bash
.\backup-beacon-simulation.bat
```

This creates a backup in the `backup_working_version` directory.

## Market Mechanics
- Ideas start trading at $1
- Graduate when reaching $50K market cap
- Real-time market simulation includes:
  * Price movements based on market sentiment
  * Trading volume visualization
  * Graduation progress tracking
  * Trending Ideas detection
  * Price impact animations
  * AI-powered idea generation
  * Enhanced notification system

## Interface Structure
- Left sidebar: Navigation
- Top bar: Network status, wallet connection
- Left column: New Ideas creation with AI assistance, Trending list
- Center: Active Ideas trading table
- Right column: $ROLODEXTER stats, Featured Ideas (top 3)

## Key Metrics
- 24h Volume
- Ideas Minted
- Graduated Ideas
- Market Sentiment
- Trading Activity

## LLM Context Prompt
```
You are assisting with the Beacon NFT Platform simulation. Key concepts:

CORE CONCEPT:
Beacon is a platform where users mint URLs as tradeable NFTs called "Ideas". When an Idea reaches $50K market cap, it "graduates" to major exchanges.

KEY FEATURES:
- Real-time market simulation with sentiment analysis
- AI-assisted idea description generation via rolodexter
- Featured Ideas showcase (top 3 trending)
- Portfolio management with performance tracking
- Interactive product tour with cursor simulation
- Continuous market with 15+ active ideas
- Enhanced notification system for market events
- $ROLODEXTER token for governance and staking

USER INTERFACE:
1. Exchange View
   - New Ideas creation (URL → NFT minting)
   - Active Ideas trading table
   - Trending Ideas list
   - Featured Ideas showcase
   - $ROLODEXTER token metrics

2. Portfolio View
   - Portfolio value tracking
   - Holdings management
   - Recent activity feed
   - Trading & staking rewards
   - Performance analytics

SIMULATION MECHANICS:
- Starting price: $1.00
- Graduation threshold: $50K market cap
- Market sentiment influence on price
- Dynamic trading volume
- Holder count simulation
- Real-time price updates
- Automated market making

TECHNICAL STACK:
- TypeScript/JavaScript
- Chart.js for visualizations
- Solana DevNet integration
- Real-time WebSocket updates
- Automated backup system

## Development
- Node.js 18+
- TypeScript 5.0+
- Web Components
- Canvas API for visualizations

## Recent Updates
- Enhanced tour system
- Improved animation performance
- Added market analysis capabilities
- Real-time chat functionality
- Technical analysis tools

## License
// ...existing code...