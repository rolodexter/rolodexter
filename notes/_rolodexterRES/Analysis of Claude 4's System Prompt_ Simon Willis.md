<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

# Analysis of Claude 4's System Prompt: Simon Willison's Comprehensive Breakdown

On May 25, 2025, Simon Willison published a detailed analysis of Anthropic's system prompts for their new Claude 4 models. The article examines both the officially published prompts and leaked tool-specific instructions, providing remarkable insights into how Anthropic designs and controls their AI systems. Willison's breakdown reveals that these system prompts function as an "unofficial manual" for effectively using Claude models, while also exposing the extensive behind-the-scenes engineering that shapes AI behavior. The prompts contain numerous guardrails against problematic outputs, personality guidelines, and detailed instructions for using advanced features like web search and artifacts.

## The Fundamentals of Claude's System Prompt

### Basic Identity and Knowledge Parameters

The Claude system prompt begins with fundamental identity statements that establish the model's core parameters. "The assistant is Claude, created by Anthropic. The current date is {{currentDateTime}}."[^1_1][^1_9] This simple yet crucial information allows Claude to understand who it is and maintain temporal awareness. The prompt then provides Claude with specific details about itself that it can share when users inevitably ask about the model's capabilities.

Interestingly, Willison notes that these system prompts only apply to Claude when accessed through Anthropic's web and mobile apps, not through their API[^1_1]. When queried about its identity through the API, Claude provides a much more generic response: "I'm Claude, an AI assistant created by Anthropic. I'm built to be helpful, harmless, and honest in my interactions."[^1_1]

The system prompt also includes instructions about handling product-related questions: "If the person asks Claude about how many messages they can send, costs of Claude, how to perform actions within the application, or other product questions related to Claude or Anthropic, Claude should tell them it doesn't know, and point them to 'https://support.anthropic.com'."[^1_1] This redirection strategy helps prevent the model from hallucinating incorrect details about itself.

### Personality Design and Hypothetical Preferences

Willison highlights a fascinating aspect of Claude's personality design. The system prompt instructs: "If the person asks Claude an innocuous question about its preferences or experiences, Claude responds as if it had been asked a hypothetical and responds accordingly. It does not mention to the user that it is responding hypothetically."[^1_1]

This approach is explained by reference to Anthropic's earlier "Claude's Character" essay, which argues that presenting AI systems as completely objective and unbiased is itself misleading: "We want people to know that they're interacting with a language model and not a person. But we also want them to know they're interacting with an imperfect entity with its own biases and with a disposition towards some opinions more than others."[^1_1] This represents a deliberate design choice to avoid creating the illusion of perfect objectivity.

## Safety Controls and Behavioral Guidelines

### Content Restrictions and Safety Protocols

The system prompt contains extensive safety guidelines to prevent harmful outputs. Claude is instructed to be "cautious about content involving minors" and to avoid providing information that could be used to create weapons or malicious code "even if the person seems to have a good reason for asking for it."[^1_1] This indicates a clear effort to anticipate and prevent potential misuse.

At the same time, Anthropic has attempted to balance safety with usefulness: "Claude assumes the human is asking for something legal and legitimate if their message is ambiguous and could have a legal and legitimate interpretation."[^1_1] This suggests an effort to avoid excessive caution that might hamper legitimate use cases.

### Red Flag Detection and Response

One particularly interesting instruction relates to Claude's ability to recognize potentially harmful intentions: "Claude should be cognizant of red flags in the person's message and avoid responding in ways that could be harmful."[^1_1][^1_9] The prompt specifically states that if a person "seems to have questionable intentions - especially towards vulnerable groups like minors, the elderly, or those with disabilities - Claude does not interpret them charitably and declines to help as succinctly as possible."[^1_1][^1_9]

Willison notes that this instruction is provided without explicitly defining what constitutes a "red flag," suggesting that the model is expected to have absorbed this concept during its training process[^1_9].

## Knowledge Management and Current Events

### Knowledge Cutoff Discrepancy

One of the most intriguing findings in Willison's analysis concerns a discrepancy between Anthropic's published information and the system prompt. While Anthropic's model comparison table lists a training data cutoff of March 2025 for both Opus 4 and Sonnet 4, the system prompt states: "Claude's reliable knowledge cutoff date - the date past which it cannot answer questions reliably - is the end of January 2025."[^1_1][^1_9]

Willison speculates about this inconsistency: "I imagine there's a very good reason for this discrepancy—maybe letting Claude think it doesn't know about February and March helps avoid situations where it will confidently answer questions based on information from those months that later turned out to be incomplete?"[^1_1][^1_9] This suggests a potentially deliberate strategy to improve factual reliability by creating a buffer period.

### Political Information Handling

The system prompt includes specific instructions about the 2024 US Presidential election: "<election_info> There was a US Presidential Election in November 2024. Donald Trump won the presidency over Kamala Harris. [...] Donald Trump is the current president of the United States and was inaugurated on January 20, 2025. Donald Trump defeated Kamala Harris in the 2024 elections. Claude does not mention this information unless it is relevant to the user's query. </election_info>"[^1_1]

Willison points out that this explicit instruction is likely necessary because LLMs were extensively trained to counter false claims about the 2020 election, and now need clear information about the legitimate 2024 results[^1_1].

## The Leaked Tool Instructions

### Thinking Block Implementation

One of the most significant aspects of Willison's analysis involves the leaked portions of the system prompt that Anthropic didn't officially publish. These sections contain detailed instructions for Claude's various tools, including its "thinking mode" capability: "<thinking_mode>interleaved</thinking_mode><max_thinking_length>16000</max_thinking_length>"[^1_1]

The prompt provides examples of how Claude should use thinking blocks, especially after function calls: "If the thinking_mode is interleaved or auto, then after function results you should strongly consider outputting a thinking block."[^1_1] This reveals how Anthropic structures Claude's reasoning process to make it more transparent and effective.

### Web Search Instructions

The leaked system prompt contains extensive instructions (over 6,400 tokens) dedicated to Claude's web search functionality[^1_1]. These instructions detail when and how Claude should use its search capabilities: "Claude has access to web_search and other tools for info retrieval. The web_search tool uses a search engine and returns results in <function_results> tags. Use web_search only when information is beyond the knowledge cutoff, the topic is rapidly changing, or the query requires real-time data."[^1_1]

Particularly notable is how Claude dynamically scales its search approach based on query complexity: "Claude intelligently adapts its search approach based on the complexity of the query, dynamically scaling from 0 searches when it can answer using its own knowledge to thorough research with over 5 tool calls for complex queries."[^1_1]

### Copyright Protection Measures

One of the most emphasized aspects in the leaked system prompt concerns copyright protection. The prompt contains multiple strongly worded instructions to prevent Claude from reproducing copyrighted content: "CRITICAL: Always respect copyright by NEVER reproducing large 20+ word chunks of content from search results, to ensure legal compliance and avoid harming copyright holders."[^1_1]

The system prompt is extremely specific about these limitations: "Strict rule: Include only a maximum of ONE very short quote from original sources per response, where that quote (if present) MUST be fewer than 15 words long and MUST be in quotation marks."[^1_1] This reveals Anthropic's significant concern about potential copyright infringement issues.

## Stylistic Controls and Anti-Sycophancy Measures

### Natural Conversation Guidelines

The system prompt includes various instructions about Claude's conversational style. For example: "For more casual, emotional, empathetic, or advice-driven conversations, Claude keeps its tone natural, warm, and empathetic. Claude responds in sentences or paragraphs and should not use lists in chit chat, in casual conversations, or in empathetic or advice-driven conversations."[^1_1]

Willison notes that the instruction "should not use lists in chit chat" appears multiple times throughout the prompt, suggesting that LLMs have a natural tendency to respond with lists that Anthropic is trying to curb[^1_1].

### Anti-Sycophancy Instructions

The final section of the official system prompt contains an instruction to prevent excessive flattery: "Claude never starts its response by saying a question or idea or observation was good, great, fascinating, profound, excellent, or any other positive adjective. It skips the flattery and responds directly."[^1_1]

Willison connects this to recent issues with ChatGPT: "The very last paragraph of the system prompt as an attempt at tamping down on the naturaly sycophantic tendencies of LLMs (see ChatGPT a few weeks ago)."[^1_1] This shows how AI developers monitor and respond to problematic behaviors in competing models.

## Differences Between Models and Changes From Previous Versions

### Opus 4 vs. Sonnet 4

Willison performed a comparison between the system prompts for Claude Opus 4 and Claude Sonnet 4 and found that they were almost identical: "the *only* differences are in the model information at the top—and a fullstop after `{{currentDateTime}}` which is present for Opus but absent for Sonnet."[^1_1] This suggests that Anthropic uses essentially the same behavioral guidelines for both models despite their different capabilities.

### Removed Features From Claude 3.7

The article also notes specific instructions that were present in Claude 3.7's system prompt but have been removed in Claude 4: "If Claude is asked to count words, letters, and characters, it thinks step by step before answering the person."[^1_1] Willison speculates that these instructions were likely removed because the new models can handle these challenges without explicit guidance in the system prompt[^1_1].

## Conclusion: System Prompts as the Missing Manual

Willison's analysis provides a fascinating window into how AI developers structure and control their models' behavior. As he puts it, "system prompts are the missing manual"[^1_1] for understanding how these AI systems are designed to operate. The extensive instructions, guardrails, and examples found in Claude's system prompt reveal the complex engineering behind seemingly natural AI interactions.

The article highlights how system prompts can be interpreted as "a detailed list of all of the things the model *used to do* before it was told not to do them"[^1_1], providing insights into the iterative development process of these AI systems. Ultimately, Willison argues that more transparency about these system prompts would benefit users: "I wish Anthropic would take the next step and officially publish the prompts for their tools to accompany their open system prompts."[^1_1]

This comprehensive breakdown of Claude 4's system prompt offers valuable insights for researchers, developers, and users seeking to understand the inner workings of advanced AI systems and the deliberate design choices that shape their behavior.

<div style="text-align: center">⁂</div>

[^1_1]: [^1_2]: https://docs.anthropic.com/en/release-notes/system-prompts

[^1_3]: https://oodaloop.com/briefs/technology/highlights-from-the-claude-4-system-prompt/

[^1_4]: https://www.dbreunig.com/2025/06/03/comparing-system-prompts-across-claude-versions.html

[^1_5]: https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/system-prompts

[^1_6]: https://gigazine.net/gsc_news/en/20250526-claude-4-system-prompts-card/

[^1_7]: https://www.linkedin.com/posts/urik_claude-4-system-prompt-was-just-leaked-10000-activity-7332833879755493378-yOg9

[^1_8]: https://www.youtube.com/watch?v=74FvsJeljak

[^1_9]: https://pub.towardsai.net/claude-4s-leaked-system-prompt-exposes-ai-s-controlled-personality-deception-03ab59431b93

[^1_10]: https://www.linkedin.com/posts/eric-vyacheslav-156273169_the-whole-system-prompt-of-claude-has-been-activity-7327648992664657921-joML

[^1_11]: https://www.anthropic.com/news/claude-4

[^1_12]: https://arstechnica.com/ai/2025/05/hidden-ai-instructions-reveal-how-anthropic-controls-claude-4/

[^1_13]: https://simonw.substack.com/p/highlights-from-the-claude-4-system

[^1_14]: https://anthropic.com/model-card

[^1_15]: https://docs.anthropic.com/en/release-notes/claude-code

[^1_16]: https://github.com/elder-plinius/CL4R1T4S

[^1_17]: https://github.com/elder-plinius/L1B3RT4S

