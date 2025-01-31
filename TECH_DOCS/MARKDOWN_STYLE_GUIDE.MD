# MARKDOWN STYLE GUIDE

## Introduction
This style guide defines conventions for naming, formatting, and organizing markdown files across the entire repository. These formatting decisions ensure consistency because the content is mirrored across GitHub, GitBook, and other platforms.

## File Naming Conventions
- **All file names must be in ALL CAPS.**
- **Spaces must be replaced with underscores (`_`).**
- **File extensions must be in uppercase `.MD`.**
- **File names must not exceed 50 characters.**

### Examples:
✅ VALID: `TECH_DOCS_GUIDE.MD`
❌ INVALID: `tech_docs_guide.md`
❌ INVALID: `TECH DOCS GUIDE.md`
❌ INVALID: `VERY_LONG_FILE_NAME_THAT_EXCEEDS_FIFTY_CHARACTERS.MD`

## Top Heading Conventions
- **The first-level heading (`#`) must be in ALL CAPS.**
- **Must not exceed 30 characters.**
- **No special characters or emojis allowed.**

### Examples:
✅ VALID: `# STYLE GUIDE`
❌ INVALID: `# Style Guide`
❌ INVALID: `# STYLE GUIDE 🚀`

## Subheading Conventions
- **Subheadings (`##`, `###`) must follow sentence case.**
- **Avoid exceeding 50 characters.**

### Examples:
✅ VALID: `## Subheading Example`
❌ INVALID: `## SUBHEADING EXAMPLE`
❌ INVALID: `## This is a Very Long Subheading That is Over Fifty Characters Long`

## General Formatting Rules
- Use `**bold**` for emphasis and `_italics_` for highlights.
- Use triple backticks (```) for code blocks.
- Use relative paths for links (e.g., `[example](../OTHER_FILE.MD)`).

