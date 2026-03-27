/**
 * 資料庫初始化腳本
 * 執行方式：npm run seed
 *
 * 需求：在 .env.local 中設定 SUPABASE_DB_URL
 * 路徑：Supabase Dashboard > Settings > Database > Connection string (URI)
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { Client } from 'pg'

// 載入 .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const dbUrl = process.env['SUPABASE_DB_URL']

if (!dbUrl || dbUrl.startsWith('請填')) {
  console.error('❌ 請先在 .env.local 設定 SUPABASE_DB_URL')
  console.error('   路徑：Supabase Dashboard > Settings > Database > Connection string (URI)')
  process.exit(1)
}

const client = new Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
})

async function main() {
  await client.connect()
  console.log('🔗 已連線至資料庫...')

  // ── 1. updated_at 自動更新觸發函式 ───────────────────────────────────────
  await client.query(`
    CREATE OR REPLACE FUNCTION trigger_set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `)
  console.log('✅ trigger_set_updated_at 函式已建立')

  // ── 2. projects 表 ─────────────────────────────────────────────────────
  await client.query(`
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
  `)
  console.log('✅ projects 表已建立')

  // ── 3. projects.updated_at 觸發器 ───────────────────────────────────────
  await client.query(`
    DROP TRIGGER IF EXISTS set_projects_updated_at ON projects;
    CREATE TRIGGER set_projects_updated_at
      BEFORE UPDATE ON projects
      FOR EACH ROW
      EXECUTE FUNCTION trigger_set_updated_at();
  `)
  console.log('✅ projects updated_at 觸發器已建立')

  // ── 4. templates 表 ────────────────────────────────────────────────────
  await client.query(`
    CREATE TABLE IF NOT EXISTS templates (
      id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
      name         TEXT    NOT NULL,
      category     TEXT    NOT NULL DEFAULT 'general',
      default_data JSONB   NOT NULL DEFAULT '{}',
      preview_url  TEXT,
      is_active    BOOLEAN NOT NULL DEFAULT true
    );
  `)
  console.log('✅ templates 表已建立')

  await client.end()
  console.log('\n🎉 資料庫地基已蓋好！')
}

main().catch(async (err: Error) => {
  console.error('❌ 錯誤：', err.message)
  await client.end()
  process.exit(1)
})
