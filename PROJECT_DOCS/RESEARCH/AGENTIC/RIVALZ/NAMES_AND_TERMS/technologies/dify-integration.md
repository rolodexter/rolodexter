# Dify Integration

## Overview
A forked version of Dify being used for bot integration in Rivalz projects, primarily powering the chat.sidelined.ai interface.

## Implementation
- Powers chat.sidelined.ai
- ChatGPT-like functionality
- Custom authentication layer
- Embedded chat capabilities

## Current Issues (as of Feb 2025)
- Embed functionality not working stably
- Login issues with embedded version
- 404 errors when embedding chatbot on website
- Not updated with latest Dify updates

## Planned Fixes
1. Get latest updates from Dify about embed functionality
2. Implement origin website whitelisting for iframe security
3. Connect third-party integrations (Google, Dynamic xyz)
4. Fix login functionality for embedded version

## Status
- In roadmap for fixes
- Requires security considerations for iframe embedding
- Original Dify didn't have login function for embed
- Custom modifications made to require user login for bot access

## Active Deployments
- chat.sidelined.ai - Main chat interface
- Embedded chat widgets (currently experiencing stability issues)

## Integration Points
- [Sidelined AI](/NAMES_AND_TERMS/products/sidelined-ai.md): Primary deployment powering chat interface
- [Vord](/NAMES_AND_TERMS/technologies/vord.md): Core platform integration
- [Daniel Ho](/NAMES_AND_TERMS/people/daniel-ho.md): Technical oversight (CTO)
- [Thai Le](/NAMES_AND_TERMS/people/thai-le.md): Template and banner updates

## Technical Stack
- Chat Interface: chat.sidelined.ai
- Authentication: Custom layer
- Deployment: Embedded and standalone

## Related Terms
- [Sidelined AI](/NAMES_AND_TERMS/products/sidelined-ai.md): Main product implementation
- [Vord](/NAMES_AND_TERMS/technologies/vord.md): Platform foundation
- [Thai Le](/NAMES_AND_TERMS/people/thai-le.md): Recent UI updates
- [Liam Pham](/NAMES_AND_TERMS/people/liam-pham.md): Testing and error resolution

---
## Metadata
created: 2024-01-09
updated: 2024-01-09
author: [GitHub Copilot](https://github.com/features/copilot)
tags: [technology, integration, chat-bot, platform]
status: DRAFT
priority: P1