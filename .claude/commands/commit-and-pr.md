---
allowed-tools: TodoWrite, AskUserQuestion, "Bash(gh *)", "Bash(git switch *)", "Bash(git add *)", "Bash(git commit *)", "Bash(git push *)", Read, Grep
description: Create a Pull Request by committing changes in logical units
---

# Commit and Create Pull Request

Create commits in logical units and a Pull Request from current changes.

## Quick Reference

```bash
# Basic usage
/commit-and-pr

# Create draft PR
/commit-and-pr draft
```

**What this command does:**

1. Creates a branch (if on main)
2. **Reviews changes and creates multiple commits by logical units** (e.g., implementation, tests, docs separately)
3. Pushes all commits to remote
4. Creates a PR with structured title/body

**IMPORTANT:**

- Changes should be committed in logical units (e.g., separate commits for implementation, tests, documentation)
- Each commit should represent one logical change following conventional commits format

## Arguments

- `draft` (optional): Create as draft PR

## Workflow

1. **Create Todo List**: Use TodoWrite to plan the following tasks:
   - Check git status and current branch
   - Create new branch if on main with changes
   - Review and group changes into logical units
   - Create commits by logical units (one commit per logical change)
   - Push all commits to remote
   - Check if PR exists
   - Detect related issues and ask user for confirmation/URLs
   - Create PR if needed (include issue URLs in description)
   - Provide summary with PR URL and commits

2. **Check Git Status**:

   ```bash
   git status
   git branch --show-current
   ```

3. **Branch Management**:
   - If on `main` branch with changes:
     - Create a new branch with descriptive name based on changes
     - Use format: `feature/`, `fix/`, `refactor/`, or `docs/` prefix
   - Switch to the branch if needed

4. **Review and Group Changes**:

   First, review all changes and identify logical units:

   ```bash
   git status                    # See all changed files
   git diff                      # Review unstaged changes
   git diff --stat               # Summary of changes
   ```

   **Group changes by logical units**. Each commit should represent one logical change:

   - ✅ Good: Separate commits for different features/fixes
   - ✅ Good: Separate commits for implementation and tests
   - ✅ Good: Separate commits for refactoring and bug fixes
   - ❌ Bad: Mixing unrelated changes in one commit
   - ❌ Bad: Committing everything at once without logical grouping

   **Examples of logical units**:
   - Fix specific bug → one commit
   - Add new feature → one commit (or multiple if complex)
   - Refactor module → one commit
   - Add tests for feature → separate commit
   - Update documentation → separate commit

5. **Create Commits by Logical Units**:

   For each logical unit, stage and commit separately:

   ```bash
   # Option 1: Stage specific files
   git add path/to/file1.ts path/to/file2.ts
   git commit -m "feat(module): add new feature X"

   # Option 2: Stage by pattern
   git add src/components/**/*.tsx
   git commit -m "refactor(components): extract common logic"

   # Option 3: Interactive staging (for partial file changes)
   git add -p path/to/file.ts    # Stage hunks interactively
   git commit -m "fix(validation): improve error handling"

   # Option 4: Stage all files of one type
   git add **/*test.ts
   git commit -m "test(feature): add unit tests for feature X"
   ```

   **Commit Message Format** (Conventional Commits):

   ```text
   type(scope): brief description

   [optional body for more details]
   ```

   Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`, `perf`

   **Examples**:

   ```bash
   # Feature implementation
   git add src/app/api/auth/route.ts src/lib/supabase.ts
   git commit -m "feat(auth): implement magic link authentication"

   # Then add tests separately
   git add src/app/api/auth/route.test.ts
   git commit -m "test(auth): add tests for authentication flow"

   # Documentation update
   git add README.md docs/authentication.md
   git commit -m "docs(auth): update authentication documentation"
   ```

   **Interactive Staging Tips**:

   ```bash
   git add -p <file>    # Review and stage changes hunk by hunk
   # Commands in interactive mode:
   # y - stage this hunk
   # n - skip this hunk
   # s - split this hunk into smaller hunks
   # e - manually edit this hunk
   # q - quit (already staged hunks remain staged)
   ```

6. **Push to Remote**:

   After creating all commits, push the branch with all commits to remote:

   ```bash
   git push -u origin <branch-name>
   ```

   **Note**: All commits will be included in the same PR. The PR will show the complete history of logical changes.

7. **Check Existing PR**:

   ```bash
   gh pr list --head <branch-name>
   ```

8. **Detect Related Issues and Ask User for Confirmation/URLs**:

   **Step 8.1: Auto-detect issue candidates**

   Check for issue references in branch name and commit messages:

   ```bash
   # Get current branch name
   BRANCH=$(git branch --show-current)

   # Extract issue patterns from branch name (e.g., feature/123-description)
   echo "$BRANCH" | grep -oE '#[0-9]+|[0-9]+'

   # Check commit messages for issue references
   git log main..HEAD --pretty=format:"%s %b" | grep -oE '#[0-9]+'
   ```

   **Common issue patterns**:
   - GitHub Issues: `#123`, `456`

   **Step 8.2: Ask user for confirmation using AskUserQuestion**

   If issues are detected, ask the user to confirm and provide full URLs:

   ```text
   AskUserQuestion:
   - Question: "以下のIssueが検出されました。関連するIssueのURLを入力してください（複数ある場合は改行で区切ってください）"
   - Show detected issues as context (e.g., "検出: #123, #456")
   - Provide text input field for user to enter full URLs
   ```

   If no issues are detected:

   ```text
   AskUserQuestion:
   - Question: "このPRに関連するIssueはありますか？ある場合はURLを入力してください（複数ある場合は改行で区切ってください）"
   - Provide text input field
   - User can skip if no related issues
   ```

   **Expected URL formats**:
   - GitHub Issues: `https://github.com/paveg/lesson-flow/issues/123`
   - Issue number only: `#123`

   **Step 8.3: Parse and validate user input**

   - Split input by newlines
   - Trim whitespace
   - Convert issue numbers to full URLs if needed
   - Store validated issue URLs for PR description

9. **Create PR if None Exists**:
   - Analyze the changes with `git diff main...HEAD` or `git log main..HEAD`
   - Draft PR title and body:
     - **Title**: Concise summary of changes (Japanese or English based on commits)
     - **Body**: Follow this structure (use Japanese if changes suggest Japanese context):

       ```markdown
       ## 概要 / Overview
       Brief description of what this PR accomplishes

       ## 関連Issue / Related Issues
       <!-- Include issue URLs if provided by user -->
       - #123
       - #456

       ## 変更内容 / Changes
       - Key change 1
       - Key change 2
       - Key change 3

       ## テスト / Testing
       How to test these changes

       ## 備考 / Notes
       Additional context or considerations
       ```

   - **Important**: Only include "関連Issue / Related Issues" section if user provided issue URLs
   - Create PR:

     ```bash
     gh pr create --title "<title>" --body "<body>" [--draft]
     ```

   - If `draft` argument provided, add `--draft` flag

10. **Provide Summary**:
    - Display PR URL
    - Show all commits included in the PR with `git log main..HEAD --oneline`
    - Show related issues (if any)
    - Confirm completion

## Important Notes

- Always use TodoWrite to track progress
- Mark each todo as in_progress before starting, completed after finishing
- If PR already exists, inform user and confirm

### Commit Best Practices

- **Separate commits by logical units**: Don't mix unrelated changes in one commit
- **Use conventional commits format**: `type(scope): description`
- **Keep commits focused**: Each commit should represent one logical change
- **Separate implementation and tests**: Prefer separate commits for code and tests
- **Use interactive staging (`git add -p`)** when file contains multiple logical changes
- **Review changes before committing**: Use `git diff`, `git diff --stat` to understand what you're committing

### Language

- Use Japanese for PR title/body if codebase context suggests it (check existing PRs)
- Commit messages can be in English (following conventional commits)

## Error Handling

- If branch creation fails, check if branch already exists
- If PR creation fails, check if PR already exists for the branch
- If commit fails, check for uncommitted changes or conflicts
