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

## Heading Conventions

### **Top-Level Headings (`#`)**

- **Must be in ALL CAPS.**
- **Must not exceed 30 characters.**
- **No special characters or emojis allowed.**
- **Use section identifiers for clarity.**

### **Subheadings (`##`, `###`)**

- **Use Title Case for Level 2 Headings (`##`).**
- **Use Sentence Case for Level 3+ Headings (`###`).**
- **Avoid exceeding 50 characters.**

### Examples

✅ VALID: `# DOCUMENT STRUCTURE`
✅ VALID: `## Content Formatting`
✅ VALID: `### Using Consistent Styles`
❌ INVALID: `# Document Structure`
❌ INVALID: `## CONTENT FORMATTING`
❌ INVALID: `### THIS IS ALL CAPS`

## General Formatting Rules

- Use `**bold**` for emphasis and `_italics_` for highlights.
- Use triple backticks (```) for code blocks.
- Use relative paths for links **with ALL CAPS naming for markdown files** (e.g., `[example](/TECH_DOCS/OTHER_FILE.MD)`).

### Example of Correct Relative Link Usage

```
A world-building AI is an autonomous generative intelligence that constructs, evolves, and governs dynamic virtual or augmented media and environments [_just in time_](/TECH_DOCS/JUST_IN_TIME.MD).
```

## Lists and Bullet Points

- **Use hyphens (`-`) for unordered lists.**
- **Use numbers (`1.`, `2.`) for ordered lists.**
- **Indent nested lists with two spaces.**

### Example

✅ VALID:

```
- First item
  - Nested item
- Second item
```

❌ INVALID:

```
* First item
 * Nested item
```

## Additional Resources and Configurations

- **IDE Extensions and Linting Configurations**
  - Various `.json` files for IDE extensions such as `markdownlint` can be found in the **root directory of the repository** and within the **root folder and subfolders of the `SCRIPTS` directory**.

- **LLM Prompt Alignment**
  - Predefined **LLM prompts** to help align content can be found in `LITERARY_PRODUCTS/PROMPTS`.
  - Some prompts are **LLM and model-specific**, ensuring consistency when generating Markdown files.

### Notes

- This **ALL CAPS rule only applies to markdown files and folder names**.
- All other files (e.g., Python scripts, JSON files) should follow standard lowercase naming conventions.
