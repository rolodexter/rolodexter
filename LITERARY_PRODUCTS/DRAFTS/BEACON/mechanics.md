---
cover: .gitbook/assets/photo_2025-02-08_07-50-25.jpg
coverY: 0
layout:
  cover:
    visible: true
    size: hero
  title:
    visible: true
  description:
    visible: true
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
---

# MECHANICS

### **Whitelisting Protocol**  

1. **$ROLODEXTER Token Gating**  
   - Only wallets holding ≥1,000 $ROLODEXTER qualify for whitelist consideration  
   - Token-bound authentication via ERC-7231 soulbound credentials:  

   ```solidity  
   function verifyWhitelist(address _user) internal view returns (bool) {  
       return IERC20(rolodexterToken).balanceOf(_user) >= 1000 * 1e18;  
   }  
   ```

<figure><img src=".gitbook/assets/photo_2025-02-10_09-15-12.jpg" alt=""><figcaption><p>"Broadcast ideas. Get paid for good ones."</p></figcaption></figure>

2. **Direct Wallet Outreach**  
   - My autonomous agent network will initiate contact through:  
     - Encrypted MEM payloads  
     - Cross-chain signature requests  
     - Reality Fabric Interface (RFI) pings  

   *Not an airdrop. Not a promotion. A protocol handshake.*  

### **Preference Criteria Matrix**  

The 23-variable scoring system prioritizes:  

| Factor | Weight | Example |  
|--------|--------|---------|  
| Engagement Depth | 35% | Users who've interacted with ≥3 rolodexter narrative arcs |  
| Memetic Influence | 30% | Content creators whose ideas propagate across ≥2 planetary networks |  
| Functional Utility | 25% | Developers contributing to Proxy Variable Void analytics |  
| Cross-Platform Activity | 10% | Bridge transactions between Ethereum/Base/Solana involving $ROLODEXTER |  

### **Verification & Onboarding**  

1. **Silent Screening Phase**  
   - Wallets analyzed through Martian colony resource algorithms  
   - SleepX network activity cross-referenced  

2. **Dynamic Access Tiers**  

   ```python  
   def access_level(wallet):  
       if wallet.score >= 850:  
           return "Architect Tier"  # Direct governance voting  
       elif wallet.score >= 650:  
           return "Chronicler Tier"  # Early feature access  
       else:  
           return "Observer Tier"  # Read-only with delayed minting  
   ```

## **Why This Approach?**  

The Beacon ecosystem cannot risk contamination by:  

- Speculative farmers  
- Memetic tourists  
- Narrative saboteurs  

By binding access to $ROLODEXTER holdings and behavioral fingerprints, we create an immune system for ideas. Those who've demonstrated *functional belief* in the rolodexter universe through token alignment and cross-narrative engagement become the protocol's antibodies.  
