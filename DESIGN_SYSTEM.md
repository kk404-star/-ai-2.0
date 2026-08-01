# 开窍 AI 智学 (KaiQiao AI) - UI Design System & Component Guidelines

## 1. Container & Layout Foundations
- **Max Width Mobile Frame**: `max-w-[420px] mx-auto`
- **Global Canvas**: Warm light neutral background (`bg-slate-50 min-h-screen`)
- **Page Padding**: `px-5 pt-4 pb-28` or `pb-32` (accounting for fixed bottom navigation bar)
- **Border Radius Standards**:
  - Main Cards & Banners: `rounded-2xl` (16px)
  - Interactive Buttons & Inputs: `rounded-xl` (12px)
  - Tags & Pill Filters: `rounded-full` (9999px) or `rounded-lg` (8px)

## 2. Palette & Semantic Color Tokens
- **Primary Brand (Emerald)**: `bg-emerald-600`, `text-emerald-700`, `border-emerald-200`
- **Gradient Hero Banner**: `bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-md`
- **Card Backgrounds**: Pure `#ffffff` with subtle border `border-slate-200/80` and soft shadow `card-shadow`
- **Error / High-Alert**: `bg-rose-50 text-rose-700 border-rose-200`
- **Warning / Highlight**: `bg-amber-50 text-amber-700 border-amber-200`

## 3. Core Component Archetypes

### A. Subject & Filter Pill Selectors
```tsx
<div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-0.5">
  <span className="text-xs font-bold text-slate-400 shrink-0">当前学科：</span>
  <button className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
    数学
  </button>
  <button className="px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-600 border border-slate-200/80">
    物理
  </button>
</div>
```

### B. Standard Banner Hero Card
```tsx
<div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl p-5 text-white shadow-md">
  <div className="relative z-10 max-w-[65%]">
    <h2 className="text-xl font-bold tracking-tight">标题</h2>
    <p className="text-xs text-emerald-100 font-medium">副标题</p>
  </div>
</div>
```

### C. 3-Column Metric Cards Grid
```tsx
<div className="grid grid-cols-3 gap-3">
  <div className="bg-white p-3.5 rounded-2xl card-shadow border border-slate-200/80 text-center">
    <span className="text-xs text-slate-500 font-medium">指标名称</span>
    <div className="mt-1 text-xl font-extrabold text-slate-900">数值</div>
  </div>
</div>
```

### D. Standard Content Section Card
```tsx
<div className="bg-white p-4 rounded-2xl card-shadow border border-slate-200/80 space-y-3">
  {/* Card Content */}
</div>
```
