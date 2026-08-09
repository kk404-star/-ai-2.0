# Today Learning Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current greeting-and-metrics home screen with a mobile-first today-learning action page that shows a primary study action, weekly progress, and real knowledge-point recommendations.

**Architecture:** Keep `HomeView` presentational and derive its recommendation data through a small pure utility from the existing `KnowledgeL1Chapter[]` tree. `App` owns navigation and passes explicit callbacks for study, practice, and opening the full knowledge catalog. Weekly rhythm remains a local display model until daily analytics exist.

**Tech Stack:** React 19, TypeScript 5.8, Tailwind CSS 4, Lucide React, GSAP, Node test runner through `tsx`.

## Global Constraints

- Preserve the existing emerald brand, white cards, light-gray canvas, radius system, and bottom navigation.
- The hero title is exactly “今天，先从一个好问题开始。”
- Reuse the existing knowledge tree and today-task progress; do not add backend APIs or a second knowledge data source.
- Show at most three recommendations in this order: 学习中, 已学习且有待练题, 未学习.
- “继续学习” and “开始学习” open knowledge study; “去练习” opens the matching practice flow.
- At 390px width there must be no horizontal scrolling, clipped copy, or bottom-navigation overlap.

---

### Task 1: Recommendation model

**Files:**
- Create: `src/utils/homeRecommendations.ts`
- Create: `src/utils/homeRecommendations.test.ts`

**Interfaces:**
- Consumes: `KnowledgeL1Chapter[]`, `SubjectType`, and `MasteryState` from `src/types.ts`.
- Produces: `HomeRecommendation` and `getHomeRecommendations(tree, subject, limit)`.

- [ ] **Step 1: Write failing tests**

Cover priority order, current-subject filtering, exclusion of fully practiced points, section metadata, and the three-item limit with `node:test` and `node:assert/strict`.

- [ ] **Step 2: Run tests and verify failure**

Run: `npx tsx --test src/utils/homeRecommendations.test.ts`

Expected: FAIL because `getHomeRecommendations` does not exist.

- [ ] **Step 3: Implement the pure selector**

Flatten chapters and sections, calculate `unpracticedQuestionCount`, retain only eligible states, sort using explicit state priorities, and slice to `limit`.

- [ ] **Step 4: Run tests and verify pass**

Run: `npx tsx --test src/utils/homeRecommendations.test.ts`

Expected: all recommendation tests PASS.

- [ ] **Step 5: Commit**

Commit only the utility and its test with message `feat: add home learning recommendations`.

### Task 2: Today-learning home composition and navigation

**Files:**
- Modify: `src/views/HomeView.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `HomeRecommendation[]`, task progress, student profile, `onStartTodayLearning`, `onOpenKnowledgePoint`, `onPracticeKnowledgePoint`, and `onOpenStudyCatalog`.
- Produces: the complete home screen and working navigation into existing study/practice screens.

- [ ] **Step 1: Add typed home data in App**

Use `useMemo` with `getHomeRecommendations(knowledgeTree, student.currentSubject, 3)` and replace the broad screen callback with explicit action callbacks.

- [ ] **Step 2: Replace the old home hierarchy**

Build three sections: a mint hero with the approved headline and primary button; a seven-day weekly rhythm card; and recommendation cards whose labels and buttons derive from mastery state.

- [ ] **Step 3: Implement empty and zero-task states**

When task total is zero, route the hero to the study tab. When recommendations are empty, display a catalog action instead of placeholder rows.

- [ ] **Step 4: Add accessibility and reduced-motion behavior**

Use semantic buttons, meaningful labels, visible focus styles, and skip the looping mascot animation under `prefers-reduced-motion`.

- [ ] **Step 5: Run static verification**

Run: `npm run lint`

Expected: TypeScript exits successfully with no diagnostics.

- [ ] **Step 6: Commit**

Commit the home and App integration with message `feat: redesign home around today learning`.

### Task 3: Responsive polish and end-to-end verification

**Files:**
- Modify: `src/index.css` only if a narrowly scoped responsive or reduced-motion rule is required.

**Interfaces:**
- Consumes: the completed home screen.
- Produces: a verified 390px mobile experience and production build.

- [ ] **Step 1: Build production assets**

Run: `npm run build`

Expected: Vite and server bundle complete successfully.

- [ ] **Step 2: Inspect the home at mobile size**

Run the local app, open the home at 390px viewport width, and capture a screenshot. Confirm the hero, weekly rhythm, recommendation actions, and fixed navigation are visible without horizontal overflow.

- [ ] **Step 3: Exercise primary interactions**

Verify the hero starts today’s practice, a learning-state recommendation opens knowledge study, a learned-state recommendation opens targeted practice, and the empty-state/catalog route reaches the study tab when applicable.

- [ ] **Step 4: Apply focused visual fixes**

Adjust only spacing, copy wrapping, button sizing, or bottom padding observed during inspection; do not alter other tabs.

- [ ] **Step 5: Re-run checks**

Run: `npx tsx --test src/utils/homeRecommendations.test.ts`, `npm run lint`, and `npm run build`.

Expected: all commands exit successfully.

- [ ] **Step 6: Commit**

Commit any polish changes with message `style: polish today learning home`.
