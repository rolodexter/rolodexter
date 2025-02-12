# Rivalz Knowledge Base Style Guide

## Document Structure

### Header Requirements
- Every document must start with a Level 1 (#) header as the title
- Must include metadata section at the bottom with creation/modification dates
- Must include a brief description after the title
- Must include relevant tags in metadata section

### Hierarchy
1. Title (H1) - Only one per document
2. Main Sections (H2)
3. Subsections (H3)
4. Minor Sections (H4)
5. Detailed Points (H5)

## Linking Conventions

### Internal Links
- Use relative paths: `../category/file-name.md`
- Link first occurrence of any term that has its own document
- Format: `[[term-name]]` for automatic linking
- All linked terms must exist in the glossary

### Cross-References
- Always use bidirectional linking
- Include "Related Terms" section at bottom of document
- Format: `- [[term-name]]: Brief context of relationship`

## Email Integration
- Emails should be converted to the following format:
```md
# Email: [Subject]

## Metadata
- From: [[person-name]]
- To: [[person-name(s)]]
- Date: YYYY-MM-DD
- Thread-ID: [if applicable]

## Content
[Formatted email content]

## Key Points
- Bullet points of main takeaways

## Action Items
- [ ] Task 1
- [ ] Task 2

## Referenced Terms
- [[term-1]]
- [[term-2]]
```

## Formatting Rules

### Lists
- Unordered lists: Use hyphen (-)
- Ordered lists: Use 1. 2. 3.
- Nested lists: 2 space indentation

### Code and Technical Terms
- Inline code: `single backticks`
- Code blocks: ```language-name
- Technical terms: `term`

### Emphasis
- *Italic* for emphasis
- **Bold** for strong emphasis
- ***Bold Italic*** for critical points
- ~~Strikethrough~~ for deprecated items

### Tables
- Must include header row
- Left-align text columns
- Right-align number columns
- Include column alignment markers

### Quotes
- Use > for quotes
- Include attribution where applicable
- Nested quotes use multiple >

## File Organization

### File Naming
- Use kebab-case: `this-is-a-file-name.md`
- No spaces or special characters
- All lowercase
- Must end in .md

### Directory Structure
- Group related files in directories
- Maximum 3 levels of nesting
- Include README.md in each directory

### Metadata Section
```md
---
created: YYYY-MM-DD
updated: YYYY-MM-DD
author: [[author-name]]
tags: [tag1, tag2, tag3]
related: [[term1]], [[term2]]
status: [draft|review|final]
---
```

## Versioning
- Use Git-style versioning
- Include change summary in commit messages
- Mark major revisions in metadata

## Images and Media
- Store in dedicated `/assets` folder
- Use relative paths
- Include alt text
- Maximum width: 800px
- Format: `![alt-text](../assets/image-name.png)`

## Tags and Categories
- Use lowercase
- Separate multiple words with hyphens
- Must be from approved tag list
- Include at least one category tag

## Priority Indicators
- P0: Critical/Urgent
- P1: High Priority
- P2: Medium Priority
- P3: Low Priority
- Format: `[P0]`, `[P1]`, etc.

## Review Status
- DRAFT: Initial creation
- REVIEW: Ready for review
- FINAL: Approved content
- Format: `status: [DRAFT|REVIEW|FINAL]`