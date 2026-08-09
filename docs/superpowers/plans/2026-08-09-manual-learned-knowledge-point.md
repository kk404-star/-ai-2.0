# Manual Learned Knowledge Point Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a safe “标记已学” path in the knowledge directory that updates the real knowledge tree and immediately offers targeted practice while preserving normal AI study entry.

**Architecture:** Extract the immutable mastery-state transition into a pure utility with tests. Keep `App` as state owner and pass one typed callback into `StudyView`; let `StudyView` own only the selected point and confirm/success modal phase.

**Tech Stack:** React 19, TypeScript 5.8, Tailwind CSS 4, Lucide React, Node test runner through `tsx`.

## Global Constraints

- Card study actions continue to open the existing AI knowledge study page.
- Only 未学习 and 学习中 points expose “标记已学”.
- Confirm updates the matching point to 已学习 without downgrading 已练习.
- Success offers “去练习巩固” and “稍后再说”.
- Use the existing emerald design system; no blue primary buttons.
- Do not add backend APIs or change quiz evaluation behavior.

---

### Task 1: Immutable mastery transition

**Files:**
- Create: `src/utils/knowledgeMastery.ts`
- Create: `src/utils/knowledgeMastery.test.ts`

**Interfaces:**
- Consumes: `KnowledgeL1Chapter[]` and a knowledge point code.
- Produces: `markKnowledgePointAsLearned(tree, code): KnowledgeL1Chapter[]`.

- [ ] **Step 1: Write failing tests**

Use `node:test` to prove that the matching 未学习/学习中 point becomes 已学习, unrelated points remain unchanged, a missing code is a no-op, and 已练习 is never downgraded.

- [ ] **Step 2: Verify red**

Run `npx tsx --test src/utils/knowledgeMastery.test.ts` and confirm it fails because the utility is missing.

- [ ] **Step 3: Implement the transition**

Traverse chapter, section, and point arrays immutably; return the original tree when no state changes and preserve 已练习.

- [ ] **Step 4: Verify green**

Run `npx tsx --test src/utils/knowledgeMastery.test.ts` and confirm all tests pass.

- [ ] **Step 5: Commit**

Commit the utility and test with message `feat: add knowledge learned transition`.

### Task 2: Directory action, modal flow, and deployment

**Files:**
- Modify: `src/views/StudyView.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `onMarkKnowledgeAsLearned(code: string): void`, existing selection callback, and existing targeted practice callback.
- Produces: independent study, mark-learned, cancel, defer, and targeted-practice interactions.

- [ ] **Step 1: Connect App state**

Add a callback that applies `markKnowledgePointAsLearned` to `knowledgeTree` and pass it into `StudyView`.

- [ ] **Step 2: Add the independent mark action**

For 未学习 and 学习中 cards, display “标记已学” beside the existing “学习” action. For 已学习 cards, display “去练习”; retain the existing 已练习 behavior.

- [ ] **Step 3: Add confirm and success phases**

Store `{ point, chapterTitle, sectionTitle, phase }` in `StudyView`. Confirm invokes the App callback and changes phase to success. Cancel or defer clears the modal; practice selects the same point and opens the existing question bank.

- [ ] **Step 4: Apply the design system and accessibility**

Use an emerald primary button, white rounded modal, muted backdrop, focus styles, accessible dialog labels, and a 44px minimum action height. Prevent card/action event overlap.

- [ ] **Step 5: Verify locally**

Run both utility test files, `npm run lint`, and `npm run build`. At 390×844 verify cancel preserves 未学习, confirm shows success, defer leaves 已学习, and practice opens the matching knowledge point.

- [ ] **Step 6: Commit and deploy**

Commit with message `feat: let students mark knowledge as learned`, push `main`, and verify GitHub Pages build and deploy jobs both succeed.
