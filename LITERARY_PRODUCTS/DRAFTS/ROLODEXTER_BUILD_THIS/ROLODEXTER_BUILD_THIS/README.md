# Beacon NFT Platform Simulation

Generate ideas. Get paid for good ones.

## Overview
The Beacon platform enables users to mint any URL as a tradeable NFT. Each Idea NFT captures the potential value of online content through real-time trading and graduation mechanics.

## Features
- Mint any URL as an Idea NFT
- AI-powered idea generation with rolodexter
- Real-time trading simulation with market sentiment
- Automatic graduation system for successful Ideas
- Complete trading interface with real-time charts
- Featured Ideas showcase (top 3 trending)
- Solana DevNet integration
- $ROLODEXTER token staking and governance
- Continuous market simulation with 15+ active ideas
- Enhanced notification system
- Advanced trending detection

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