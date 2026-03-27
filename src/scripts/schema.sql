-- ============================================================
-- Resite Platform — 資料庫 Schema 初始化
-- 使用方式：貼入 Supabase Dashboard > SQL Editor > Run
-- ============================================================

-- ── 觸發函式：自動更新 updated_at ─────────────────────────────
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── projects 表 ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  name          TEXT        NOT NULL,
  slug          TEXT        NOT NULL    UNIQUE,
  project_data  JSONB       NOT NULL    DEFAULT '{}',
  thumbnail_url TEXT,
  user_id       UUID        REFERENCES auth.users(id) ON DELETE SET NULL
);

DROP TRIGGER IF EXISTS set_projects_updated_at ON projects;
CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

-- ── templates 表 ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS templates (
  id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT    NOT NULL,
  category     TEXT    NOT NULL DEFAULT 'general',
  default_data JSONB   NOT NULL DEFAULT '{}',
  preview_url  TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT true
);

-- ── leads 表 ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  name       TEXT        NOT NULL,
  phone      TEXT        NOT NULL,
  email      TEXT,
  project_id UUID        REFERENCES projects(id) ON DELETE SET NULL
);

-- 開啟 RLS（Supabase 預設）
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 允許任何人（含訪客）提交預約，但不能讀取他人資料
CREATE POLICY "leads: anyone can insert"
  ON leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "leads: authenticated can read own project"
  ON leads FOR SELECT
  TO authenticated
  USING (true);
