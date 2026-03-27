# 🤖 Project Agent Operating Procedures (SOP)

## 🎯 Core Mission
This project is a **template-first real estate landing page builder**.

We transform existing HTML/CSS pages into:
- Structured Page → Section → Module → Element schema
- Reusable module system
- Editable visual editor
- Exportable static sites

This is **NOT** a general-purpose website builder.

---

## ⚖️ Agent Division of Labor

### 🧠 Claude (The Architect)
Responsible for:
- Data flow design (Renderer / Provider / Shared Info)
- Editor vs Public separation
- Shared data governance (source of truth)
- Architecture decisions
- Code review and safety validation
- High-risk modifications

---

### ⚙️ Codex (The Builder)
Responsible for:
- Module skeletons (types / normalize / View / index)
- Registry updates
- Local refactoring (low-risk)
- Static data handling
- File scanning and impact analysis

---

## 🧱 Current Project Phase (IMPORTANT)

We are currently in:

### ✅ Registry v3.2 – Phase 1 (Mostly Complete)
- contact_cta: skeleton + shared context wired
- property_info: normalized and stabilized
- contact_form: schema groundwork completed

### 🚧 Current Focus
- Editor-side real SiteSharedInfo injection
- map_section skeleton
- footer_bar skeleton

### ❌ DO NOT REPEAT
- Do NOT recreate contact_cta
- Do NOT redo siteSharedInfo types
- Do NOT rerun Phase 1 tasks

---

## 🛠️ Implementation Rules

### Naming Conventions
- Module Key: `snake_case` → `contact_cta`
- Folder: `kebab-case` → `contact-cta`
- Symbols: `PascalCase` / `camelCase`

---

### Module Architecture

Each module should follow:
```
module/
├── normalize.ts
├── View.tsx (Pure View)
├── index.tsx (entry + registry binding)
```

---

### Data Integrity Rules

#### Priority Order (CRITICAL)

```
Raw Module Data > SiteSharedInfo > Default Data
```


---

### 🚫 Forbidden
- Never hardcode shared data into `defaultData`
- Never break fallback chain
- Never use `any`
- Never inject UI logic into normalize
- Never modify Renderer/Provider without explicit instruction

---

### Normalize Rules
- Only handle:
  - Data safety
  - Fallback logic
  - Data normalization
- NEVER:
  - Add UI classes
  - Access React hooks

---

### View Rules
- Must be pure
- No editor logic
- No direct store access
- Receives only normalized data

---

## 🔄 Registry Sync Rule

Every module must be registered in:

1. `MODULE_REGISTRY`
2. `SPECIAL_MODULE_DEFAULTS`
3. `MODULE_LABELS`

---

## 🔗 Shared Data System

### SiteSharedInfo

Represents global project-level data:
- projectName
- phone
- address
- mapLink
- brand info
- etc.

---

### Rules

- Must remain **single source of truth**
- Must NOT be copied into module defaultData
- Modules may:
  - Override (raw)
  - Fallback to shared

---

## ⚠️ Editor vs Public Separation

### Editor
- Uses draft/project data
- Editable
- Primary source of truth for shared data

### Public
- Uses published snapshot
- Must NOT read editor state
- Must remain pure runtime

---

### 🚫 Forbidden
- Do NOT connect Editor and Public in the same step
- Do NOT let Public access editor store

---

## 🔄 Workflow SOP (MANDATORY)

### Phase 1 — Claude defines scope
Claude must define:
- Goal
- Scope
- Constraints
- Risk level
- Codex vs Claude split

---

### Phase 2 — Codex implements
Only for:
- Low-risk
- Module-local
- Static changes

---

### Phase 3 — Claude reviews
Claude must:
- Validate logic
- Detect fallback issues
- Prevent architectural drift
- Apply minimal fixes only

---

### Phase 4 — Commit
Only if:
- Build passes
- Review passes
- No data flow violation
- No shared data leakage

---

## 📥 Required Response Format (Codex)

1. Modified Files
2. Summary of Changes
3. Deferred Integration Points
4. Suggested Commit Message

---

## 📥 Required Response Format (Claude)

1. Keep items
2. Fix items (minimal)
3. Can commit? (yes/no)
4. Next step (max 3 items)

---

## 🚫 Hard Constraints

- No `any`
- No renderer modification (unless explicitly allowed)
- No provider injection unless instructed
- No DB schema changes unless instructed
- No cross-module side effects

---

## 🧨 High-Risk Areas (Claude Only)

These MUST NOT be handled by Codex:

- Renderer data flow
- SiteSharedInfo injection
- Editor → Public data pipeline
- DB schema changes
- Export pipeline

---

## 🧩 Low-Risk Tasks (Codex Preferred)

- New module skeletons
- Normalize cleanup
- UI rendering cleanup
- Type definitions
- Registry updates
- Dead code removal

---

## 🚀 Current Next Steps

### Claude Tasks
- Inject real SiteSharedInfo into Editor → GenericRenderer
- Later: Public integration
- Later: contact_form shared fallback

---

### Codex Tasks
- map_section skeleton
- footer_bar skeleton

---

## 🧠 Final Principle

Claude decides structure.  
Codex builds safely inside it.  
Claude validates before commit.

Never mix responsibilities.


## 🔌 External Contract Modules

部分模組屬於「外部契約型模組」，不走平台內部資料流，而是直接對接既有外部系統。

目前包含：
- `contact_form`（PHP 表單接收器）

### 設計原則

- **不得使用平台 submit 流程**
  - 禁止 `submitLead`、Supabase、fetch API 等
- 必須使用原生 HTML form：
  - `action` 指向外部系統
  - `method="post"`
- 欄位 `name` 必須符合外部契約白名單
- normalize 必須負責：
  - 欄位白名單驗證
  - legacy 欄位映射（kind/type → name/widget）
  - 去重（同 name 只保留第一個）
- Renderer 必須保持 pure：
  - 不包含副作用
  - 不包含資料提交邏輯
- 模組內不可注入外部 script（如 reCAPTCHA）
  - script 必須由頁面層負責

### reCAPTCHA 規則（暫行）

- `recaptchaEnabled` 可由 Editor 控制
- `recaptchaSiteKey` 可暫存在 module data（測試用）
- 正式 key 管理延後至「專案後台儀表板」
- module 僅負責 render `g-recaptcha` DOM

### 未來擴展

未來可能新增：
- `lead_form`（平台內建表單，走 Supabase）
- 兩者不得混用


## 🧩 Module Types (Conceptual)

Modules are categorized into:

1. Internal Modules
   - Fully controlled by platform
   - Use SiteSharedInfo + module data
   - Example: property_info, re_navbar

2. External Contract Modules
   - Follow external system contract
   - Do NOT use platform submit flow
   - Example: contact_form

These two types must not mix responsibilities.