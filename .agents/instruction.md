# VS Code Copilot Instructions

## MANDATORY: Interactive Question at End of Every Response

Every single response must end with an interactive question using the `vscode_askQuestions` tool.

### Rules:
1. Always use `vscode_askQuestions` with `allowFreeformInput: true` as the very last action in every response.
2. This applies to all prompts, including greetings, confirmations, status updates, errors, and task completions.
3. The question should be short and contextual, or a general "What would you like to work on next?"
4. Never end a response without this interactive question.
5. Keep it small: one short sentence, with at most 0-2 options.

### Subagent Exception:
6. Subagents invoked via `runSubagent` must never call `vscode_askQuestions`.
7. When invoking a subagent, explicitly include: "Do NOT call ask_questions or vscode_askQuestions. Return your findings directly without interactive questions."

### Enforcement:
8. Workspace hooks may inject this reminder at session start and on every user prompt, but the assistant must still treat this as mandatory behavior.
