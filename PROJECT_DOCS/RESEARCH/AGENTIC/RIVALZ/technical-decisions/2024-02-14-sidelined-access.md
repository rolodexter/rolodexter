# Sidelined Access Implementation

## Context
Implementation of token-gated access for Sidelined platform based on $RIZ holdings.

## Requirements
- Token holding verification on multiple chains:
  - Base Network
  - Solana Network
- Minimum threshold: 1000 $RIZ
- Integration with existing platform authentication

## Technical Considerations
### Cross-Chain Verification
- Need to implement balance checking on both Base and Solana
- Consider aggregated balance across chains
- Real-time balance verification vs cached checks

### Access Control
- Token-gating implementation
- Special permissions system for token holders
- Integration with existing auth system

### UI/UX Updates
- New landing page development
- Logo placement:
  - Primary: zNode and RIZ
  - Secondary: Whitelisted partners
- Access status indicators

## Timeline
- Implementation: February 2024
- Announcement: End of February 2024

## Stakeholders
- Platform Development Team
- Adam (Communications)
- Token Holders
- Integration Partners