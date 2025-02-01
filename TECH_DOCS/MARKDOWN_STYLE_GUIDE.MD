# MARKDOWN STYLE GUIDE

## Introduction

This style guide defines conventions for naming, formatting, and organizing markdown files across the entire repository. These formatting decisions ensure consistency because the content is mirrored across GitHub, GitBook, Obsidian, and other platforms.

## File Naming Conventions

- **All markdown file names must be in ALL CAPS.**
- **Spaces must be replaced with underscores (`_`).**
- **File extensions must be in uppercase `.MD`.**
- **File names must not exceed 50 characters.**
- **All other files (e.g., `.py`, `.jsonl`, etc.) must use lowercase naming conventions.**

### Examples

✅ VALID: `TECH_DOCS_GUIDE.MD`
❌ INVALID: `tech_docs_guide.md`
❌ INVALID: `TECH DOCS GUIDE.md`
❌ INVALID: `VERY_LONG_FILE_NAME_THAT_EXCEEDS_FIFTY_CHARACTERS.MD`

## Top Heading Conventions

- **The first-level heading (`#`) must be in ALL CAPS.**
- **Must not exceed 30 characters.**
- **No special characters or emojis allowed.**

### Examples

✅ VALID: `# STYLE GUIDE`
❌ INVALID: `# Style Guide`
❌ INVALID: `# STYLE GUIDE 🚀`

## Subheading Conventions

- **Subheadings (`##`, `###`) must follow sentence case.**
- **Avoid exceeding 50 characters.**

### Examples

✅ VALID: `## Subheading example`
❌ INVALID: `## SUBHEADING EXAMPLE`
❌ INVALID: `## This is a very long subheading that is over fifty characters long`

## General Formatting Rules

- Use `**bold**` for emphasis and `_italics_` for highlights.
- Use triple backticks (```) for code blocks.
- Use relative paths for links **with ALL CAPS naming for markdown files** (e.g., `[example](/TECH_DOCS/OTHER_FILE.MD)`).

### Example of Correct Relative Link Usage

```
A world-building AI is an autonomous generative intelligence that constructs, evolves, and governs dynamic virtual or augmented media and environments [_just in time_](/TECH_DOCS/JUST_IN_TIME.MD).
```

### Notes

- This **ALL CAPS rule only applies to markdown files and folder names**.
- All other files (e.g., Python scripts, JSON files) should follow standard lowercase naming conventions.
