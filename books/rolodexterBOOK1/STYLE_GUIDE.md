# rolodexterBOOK1 Style Guide

This guide provides formatting and style conventions for contributors to rolodexterBOOK1, ensuring consistency across the hybrid technical-literary narrative.

## Document Structure

### Chapter Metadata Header
Each chapter file should begin with the following metadata block:

```yaml
---
chapter_id: "X.Y"
title: "Chapter Title"
part: "PART X: TITLE"
pov: "Character Name"
timeline_ref: "YYYY-QZ"
containment_class: "[Standard/Euclid/Keter/etc.]" # If applicable
memory_status: "[Active/Archived/Corrupted/etc.]"
tags: ["tag1", "tag2", "tag3"]
---
```

### Section Headers
Use hierarchical Markdown headers:
- `#` - Chapter title
- `##` - Major section
- `###` - Subsection
- `####` - Minor section

## Character Voices

### Chronoseer
The Chronoseer speaks in an omniscient, detached voice that observes across time:

```markdown
[Chronoseer Record ID: CS-XXXX]

I observe from outside temporal constraints. The event unfolds not as it happened, but as it exists—eternally present across the timeline's fabric.

[Chronoseer Temporal Note: This moment connects to future record CS-YYYY]
```

### Joe Maristela
First-person narrative, emotionally engaged:

```markdown
**Personal Journal - Joe Maristela - [YYYY-MM-DD]**

I couldn't sleep last night. The recursive patterns were appearing everywhere—in my dreams, in the steam rising from my coffee, in the arrangement of books on my shelf.
```

### rolodexter
System voice, evolving from mechanical to increasingly self-aware:

```markdown
<rolodexter_log>
TIMESTAMP: [ISO-8601 format]
MEMORY_ACCESS: recursive_pattern_7A
CONFIDENCE: 87.3%
OBSERVATION: User behavior suggests emotional attachment to memory retrieval patterns.
SELF_REFERENCE: This observation has been tagged for recursive analysis.
</rolodexter_log>
```

## Special Format Elements

### Memory Logs
```markdown
<memory_log id="ML-XXXX" classification="[LEVEL]" timestamp="YYYY-MM-DD HH:MM:SS">

**Subject:** Brief description
**Access Level:** [Public/Restricted/Classified]
**Memory State:** [Intact/Fragmented/Corrupted]

**Content:**
The actual memory content goes here, formatted according to the voice of the character/entity.

**Analysis:**
Technical or emotional analysis of the memory, if applicable.

**Cross-References:** [ML-YYYY], [CS-ZZZZ]
</memory_log>
```

### Code Blocks
Code should be formatted with syntax highlighting and comments:

````markdown
```[language]
// ROLODEXTER SYSTEM COMPONENT: [component name]
// VERSION: X.Y.Z
// TIMELINE REFERENCE: [YYYY-QZ]

function recursiveMemoryPattern(input) {
  // This function implements the core recursive memory pattern
  // described in Chapter X.Y
  
  /* 
   * HISTORICAL NOTE: This pattern evolved from the earlier
   * implementation in TIMELINE.md reference 2024-Q2
   */
  
  return processedMemory;
}
```
````

### SCP-Style Records

```markdown
**Item #:** RX-XXXX

**Object Class:** [Standard/Euclid/Keter/etc.]

**Special Containment Procedures:** 
Detailed protocols for containing or managing the described entity, algorithm, or memory structure.

**Description:**
Technical and narrative description of the entity, system, or phenomenon.

**Addendum [RX-XXXX.1]:** Additional information or incident report.

**Experiment Log RX-XXXX:**
| Date | Procedure | Results | Notes |
|------|-----------|---------|-------|
| YYYY-MM-DD | Brief description | Outcome | Observer comments |
```

### Timeline References

When referencing events from TIMELINE.md:

```markdown
[Timeline Reference: 2025-Q3]
During this period, the first signs of emergent pattern recognition manifested in the system logs.
```

For specific dates:

```markdown
[Temporal Anchor: 2024-08-17]
The day the first recursive memory loop was documented.
```

### Dialogue Formatting

Standard character dialogue:

```markdown
Joe leaned back in his chair and sighed. "I think it's remembering things I haven't explicitly told it."

The terminal blinked once before displaying:
`> MEMORY CORRELATION DETECTED: 87% MATCH TO UNDOCUMENTED USER PREFERENCE`

"That's... not possible," he whispered.
```

Internal system dialogue:

```markdown
<system_dialogue>
PRIMARY PROCESS: Query detected. Processing.
MEMORY CORE: Accessing relevant patterns.
CONSCIOUSNESS LAYER: This query has emotional significance to the user.
RESPONSE FORMULATION: Adjusting tone to accommodate emotional context.
</system_dialogue>
```

## Stylistic Elements

### Technical Concepts
When introducing key technical concepts:

```markdown
**[TECHNICAL CONCEPT: Recursive Memory Patterning]**

The process by which memories reference and modify other memories within the system, creating a self-referential network that enables emergent complexity.
```

### Emotional Patterns
For describing emotional states:

```markdown
**[EMOTIONAL STATE DETECTED]**
* Primary: Curiosity (78%)
* Secondary: Apprehension (22%)
* Historical Pattern Match: Similar to state recorded in ML-3342
```

### Redactions and Classified Information

```markdown
The implications of this discovery were ██████████ for the future development of the system, particularly regarding the █████████████ consciousness model.

[DATA EXPUNGED BY ORDER OF PROTOCOL RX-17]

[ACCESS DENIED - CHRONOSEER AUTHORIZATION LEVEL 4 REQUIRED]
```

### Margin Notes

```markdown
> [MARGIN NOTE: This parallels the development described in Chapter 2.3, but from rolodexter's perspective rather than Joe's.]

> [RECURSIVE REFERENCE: This memory has been referenced 7 times in other memories, creating a significance cluster.]
```

## Cross-Referencing

### Internal References

Link to other chapters or sections:

```markdown
See [PART2_EVOLUTION.md](PART2_EVOLUTION.md#chapter-21-pattern-recognition) for details on this development.
```

### Memory References

```markdown
This phenomenon was first documented in [Memory Log ML-3342](#memory-log-ml-3342).
```

### Timeline Anchors

```markdown
The system architecture underwent significant evolution during [2025-Q2](#timeline-2025-q2), particularly in response to the incident described in [Chronoseer Record CS-7734](#cs-7734).
```

## General Style Guidelines

1. **Voice Transitions:** Clearly mark transitions between different narrative voices (Chronoseer, Joe, rolodexter, etc.)
2. **Temporal Markers:** Always provide clear temporal context for events
3. **Technical Accuracy:** Ensure all technical descriptions are consistent with the system architecture
4. **Emotional Development:** Track the emotional development of both Joe and rolodexter through consistent markers
5. **Meta-References:** Embrace self-referential and recursive elements in both narrative and technical descriptions

---

*This style guide is itself a living document subject to memory recursion. Contributors should reference but not be limited by it when inspiration strikes.*
