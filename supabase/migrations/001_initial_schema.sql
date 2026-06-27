-- ============================================================
-- Portfolio Profesi — Database Migration
-- Run this in Supabase SQL Editor to set up all tables and policies
-- ============================================================

-- ─── Enable UUID Extension ───
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Table: projects ───
CREATE TABLE IF NOT EXISTS projects (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       text NOT NULL,
  slug        text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url   text NOT NULL DEFAULT '',
  tech_stack  text[] NOT NULL DEFAULT '{}',
  live_url    text NOT NULL DEFAULT '',
  github_url  text NOT NULL DEFAULT '',
  is_featured boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ─── Table: site_config ───
CREATE TABLE IF NOT EXISTS site_config (
  id    uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  key   text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT ''
);

-- ─── Table: messages ───
CREATE TABLE IF NOT EXISTS messages (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       text NOT NULL,
  email      text NOT NULL,
  message    text NOT NULL,
  is_read    boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ─── Indexes ───
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_site_config_key ON site_config(key);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(is_read) WHERE is_read = false;

-- ─── Enable RLS ───
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- ─── RLS Policies: projects ───
CREATE POLICY "Public can view projects"
  ON projects FOR SELECT USING (true);

CREATE POLICY "Authenticated can insert projects"
  ON projects FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update projects"
  ON projects FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated can delete projects"
  ON projects FOR DELETE TO authenticated USING (true);

-- ─── RLS Policies: site_config ───
CREATE POLICY "Public can view config"
  ON site_config FOR SELECT USING (true);

CREATE POLICY "Authenticated can insert config"
  ON site_config FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update config"
  ON site_config FOR UPDATE TO authenticated USING (true);

-- ─── RLS Policies: messages ───
CREATE POLICY "Public can insert messages"
  ON messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated can view messages"
  ON messages FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can update messages"
  ON messages FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated can delete messages"
  ON messages FOR DELETE TO authenticated USING (true);

-- ─── Seed: site_config defaults ───
INSERT INTO site_config (key, value) VALUES
  ('hero_title', 'Full-Stack Developer'),
  ('hero_subtitle', 'Create ideas and solutions to problems, with modern technology.'),
  ('about_bio', 'Saya adalah seorang developer yang fokus pada pembangunan aplikasi web dan mobile modern. Dengan pengalaman dalam React, TypeScript, dan berbagai teknologi backend, saya selalu berusaha menghadirkan solusi digital yang performant, scalable, dan user-friendly.'),
  ('profile_image', ''),
  ('about_experiences', '[]')
ON CONFLICT (key) DO NOTHING;

-- ─── Updated At Trigger ───
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
