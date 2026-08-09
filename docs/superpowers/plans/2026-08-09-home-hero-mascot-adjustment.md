# Home Hero Mascot Adjustment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the hero eyebrow label and restore the previous branded robot SVG without changing homepage behavior.

**Architecture:** Make one focused presentational change in `HomeView`. Reuse the former inline SVG from repository history while preserving the current mascot container, animation, hero layout, and navigation.

**Tech Stack:** React 19, TypeScript 5.8, Tailwind CSS 4, inline SVG, GSAP.

## Global Constraints

- Remove the complete “今日学习 · 当前学科” label row and its spacing.
- Restore the former green graduation-cap, yellow-glasses, blue-eyes mascot SVG.
- Do not restore the old black mascot badge.
- Do not change home data, progress, recommendations, or navigation.
- Verify at 390px, then push to `main` and wait for GitHub Pages success.

---

### Task 1: Update and deploy the hero

**Files:**
- Modify: `src/views/HomeView.tsx`

**Interfaces:**
- Consumes: the existing `mascotRef` animation and current hero section.
- Produces: the same `HomeView` props and behavior with revised hero presentation.

- [ ] **Step 1: Remove the label row**

Delete the label container before the hero `h1`, including its bottom margin, separator dot, and `student.currentSubject` rendering.

- [ ] **Step 2: Restore the old mascot SVG**

Replace only the current face SVG with the previous 120×120 robot artwork. Keep the existing 94px container, circular decoration, `aria-hidden`, and `mascotRef`.

- [ ] **Step 3: Run static checks**

Run `npm run lint` and `npm run build`. Both commands must exit successfully.

- [ ] **Step 4: Inspect mobile rendering**

Open the homepage at 390×844 and confirm the label is absent, the old mascot is visible, and the hero has no overlap or horizontal overflow.

- [ ] **Step 5: Commit and deploy**

Commit `src/views/HomeView.tsx` with message `style: restore branded home mascot`, push `main`, and verify both GitHub Pages jobs conclude successfully.
