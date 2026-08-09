# Knowledge Detail Skip-to-Practice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the directory a pure knowledge-point selector and move “我已在学校学过，直接练题” into the selected knowledge point’s learning page.

**Architecture:** Reuse the tested `markKnowledgePointAsLearned` utility and keep `App` as the knowledge-tree owner. `StudyView` becomes a whole-card navigator with no action buttons; `KnowledgeStudyView` owns the confirm/success presentation and invokes explicit App callbacks for state change and targeted practice.

**Tech Stack:** React 19, TypeScript 5.8, Tailwind CSS 4, Lucide React, Node test runner through `tsx`.

## Global Constraints

- Directory cards contain no 学习, 练习, or 标记已学 buttons.
- Clicking a point card opens that exact point in `KnowledgeStudyView`.
- “我已在学校学过，直接练题” means mark the point 已学习, then offer targeted practice.
- 已练习 is never downgraded.
- Keep the existing emerald design system and the normal bottom practice CTA.
- Do not add backend APIs or change quiz evaluation behavior.

---

### Task 1: Simplify directory cards

**Files:**
- Modify: `src/views/StudyView.tsx`

**Interfaces:**
- Consumes: `onSelectKnowledgePointForPractice(title, code)` and `onNavigateToScreen('knowledge_study')`.
- Produces: whole-card keyboard and pointer navigation into the selected knowledge point.

- [ ] **Step 1: Remove the incorrect directory flow**

Delete `LearnedModalState`, modal state, modal rendering, `onMarkKnowledgeAsLearned`, and all per-card action buttons.

- [ ] **Step 2: Make each point card interactive**

Render each point as a semantic button with title, status, practice counts, and a trailing chevron. Clicking it selects the exact title/code and opens `knowledge_study`.

- [ ] **Step 3: Verify static behavior**

Run `npm run lint`. Expected: TypeScript exits successfully with no unused imports or prop mismatches.

### Task 2: Move mark-learned into knowledge detail

**Files:**
- Modify: `src/views/KnowledgeStudyView.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `onMarkAsLearned(): void`, `onStartTargetedPractice(): void`, and `knowledgePoint.masteryState`.
- Produces: confirm/success modal flow inside the selected knowledge point.

- [ ] **Step 1: Rewire App callbacks**

Stop passing mark state into `StudyView`. Pass `onMarkAsLearned` and `onStartTargetedPractice` into `KnowledgeStudyView`; both callbacks use the current selected code/title, and targeted practice opens the existing practice screen.

- [ ] **Step 2: Add the detail-level skip action**

For 未学习/学习中, add “我已在学校学过，直接练题” to the header card. For 已学习/已练习, show “去练习巩固”.

- [ ] **Step 3: Add confirm and success phases**

Confirm text explains the state change. “标记已学并练题” updates the tree and shows success; “继续学习” closes. Success offers “去练习巩固” and “稍后再说”.

- [ ] **Step 4: Preserve normal AI learning completion**

Keep the bottom “进入题目练习巩固” callback that marks eligible states learned before opening practice.

### Task 3: Verify and deploy

**Files:**
- No additional production files unless inspection reveals a narrowly scoped layout issue.

**Interfaces:**
- Consumes: completed directory and detail flows.
- Produces: verified mobile behavior and deployed GitHub Pages build.

- [ ] **Step 1: Run automated checks**

Run both utility test files, `npm run lint`, `npm run build`, and `git diff --check`. All must exit successfully.

- [ ] **Step 2: Test at 390×844**

Verify directory cards contain no actions, clicking a card opens the correct title, cancel keeps the original state, confirm changes it to 已学习, success opens the matching practice, and there is no horizontal overflow.

- [ ] **Step 3: Commit and deploy**

Commit with message `fix: move learned action into knowledge detail`, push `main`, and verify GitHub Pages build and deploy jobs both succeed.
