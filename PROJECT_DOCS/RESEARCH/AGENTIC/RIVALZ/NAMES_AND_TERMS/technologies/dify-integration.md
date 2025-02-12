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
- [[sidelined-ai]]: Primary deployment powering chat interface
- [[vord]]: Core platform integration
- [[daniel-ho]]: Technical oversight (CTO)
- [[thai-le]]: Template and banner updates

## Technical Stack
- Chat Interface: chat.sidelined.ai
- Authentication: Custom layer
- Deployment: Embedded and standalone

## Related Terms
- [[sidelined-ai]]: Main product implementation
- [[vord]]: Platform foundation
- [[thai-le]]: Recent UI updates
- [[liam-pham]]: Testing and error resolution

---
## Metadata
created: 2024-01-09
updated: 2024-01-09
author: [[github-copilot]]
tags: [technology, integration, chat-bot, platform]
status: DRAFT
priority: P1