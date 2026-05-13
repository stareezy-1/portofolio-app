-- Portfolio Platform Database Schema
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/_/sql

-- ─── Projects ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  thumbnail TEXT DEFAULT '',
  gallery TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  type VARCHAR(20) NOT NULL CHECK (type IN ('mobile', 'web', 'backend')),
  github_url TEXT,
  live_url TEXT,
  play_store_url TEXT,
  app_store_url TEXT,
  demo_mode BOOLEAN DEFAULT FALSE,
  emulator_config JSONB,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(type);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- ─── Resume ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS resume (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience JSONB NOT NULL DEFAULT '[]',
  education JSONB NOT NULL DEFAULT '[]',
  skills JSONB NOT NULL DEFAULT '[]',
  pdf_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO resume (experience, education, skills)
VALUES ('[]', '[]', '[]')
ON CONFLICT DO NOTHING;

-- ─── Portfolio Content (dynamic public page content) ─────────────────────────

CREATE TABLE IF NOT EXISTS portfolio_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Hero / Identity
  name VARCHAR(255) NOT NULL DEFAULT 'Your Name',
  role VARCHAR(255) NOT NULL DEFAULT 'Full Stack Engineer',
  tagline TEXT DEFAULT 'Building modern web and mobile applications.',
  bio TEXT DEFAULT 'A passionate developer focused on clean architecture and great user experiences.',
  avatar_url TEXT,
  -- Stats
  years_of_experience INT DEFAULT 0,
  projects_built INT DEFAULT 0,
  happy_clients INT DEFAULT 0,
  -- Contact
  email VARCHAR(255),
  location VARCHAR(255),
  -- Social links (stored as JSONB: [{platform, url}])
  social_links JSONB NOT NULL DEFAULT '[]',
  -- Tech stack categories (stored as JSONB: [{category, icon, skills[]}])
  tech_stack JSONB NOT NULL DEFAULT '[]',
  -- Work experience (stored as JSONB: [{id, title, organization, location, startDate, endDate, description, highlights[]}])
  work_experience JSONB NOT NULL DEFAULT '[]',
  -- Education (stored as JSONB: same shape as work_experience)
  education JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default content row
INSERT INTO portfolio_content (
  name, role, tagline, bio,
  years_of_experience, projects_built, happy_clients,
  email, location,
  social_links, tech_stack, work_experience, education
) VALUES (
  'Alex Johnson',
  'Full Stack Engineer & Mobile Developer',
  'I craft high-performance web and mobile applications with modern technologies.',
  'Passionate about clean code, great UX, and scalable architecture. From startup MVPs to enterprise platforms.',
  5, 30, 10,
  'hello@example.com',
  'San Francisco, CA',
  '[{"platform":"github","url":"https://github.com"},{"platform":"linkedin","url":"https://linkedin.com"},{"platform":"twitter","url":"https://twitter.com"},{"platform":"email","url":"mailto:hello@example.com"}]',
  '[{"category":"Frontend","icon":"🎨","skills":["React","React Native","TypeScript","Expo","Next.js"]},{"category":"Backend","icon":"⚙️","skills":["Go","Node.js","PostgreSQL","Redis","REST"]},{"category":"Mobile","icon":"📱","skills":["Expo","React Native","iOS","Android"]},{"category":"DevOps","icon":"🛠️","skills":["Docker","AWS","CI/CD","Git","Linux"]}]',
  '[{"id":"1","title":"Senior Full Stack Engineer","organization":"TechCorp Inc.","location":"San Francisco, CA","startDate":"2022","description":"Leading development of a high-traffic SaaS platform serving 100k+ users.","highlights":["Reduced API response time by 60%","Led a team of 5 engineers","Shipped 12 major features in 2023"]},{"id":"2","title":"Mobile Developer","organization":"StartupXYZ","location":"Remote","startDate":"2020","endDate":"2022","description":"Built cross-platform mobile apps with React Native and Expo.","highlights":["50k downloads in first month","Offline-first architecture","Payment processing integration"]},{"id":"3","title":"Frontend Developer","organization":"Agency Co.","location":"New York, NY","startDate":"2019","endDate":"2020","description":"Delivered responsive web applications for clients across e-commerce, fintech, and media.","highlights":["8 client projects shipped","Core Web Vitals improved by 40%"]}]',
  '[{"id":"e1","title":"B.Sc. Computer Science","organization":"State University","location":"Boston, MA","startDate":"2015","endDate":"2019","description":"Focused on software engineering, algorithms, and distributed systems.","highlights":["GPA: 3.8 / 4.0 — Dean''s List","Senior thesis on distributed consensus algorithms","President of the Programming Club"]}]'
) ON CONFLICT DO NOTHING;

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read projects" ON projects;
DROP POLICY IF EXISTS "Service role full access projects" ON projects;
DROP POLICY IF EXISTS "Public read resume" ON resume;
DROP POLICY IF EXISTS "Service role full access resume" ON resume;
DROP POLICY IF EXISTS "Public read portfolio_content" ON portfolio_content;
DROP POLICY IF EXISTS "Service role full access portfolio_content" ON portfolio_content;

CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Service role full access projects" ON projects FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Public read resume" ON resume FOR SELECT USING (true);
CREATE POLICY "Service role full access resume" ON resume FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Public read portfolio_content" ON portfolio_content FOR SELECT USING (true);
CREATE POLICY "Service role full access portfolio_content" ON portfolio_content FOR ALL USING (auth.role() = 'service_role');

-- ─── Storage Bucket ──────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public) VALUES ('files', 'files', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete files" ON storage.objects;

CREATE POLICY "Public read files" ON storage.objects FOR SELECT USING (bucket_id = 'files');
CREATE POLICY "Authenticated upload files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'files');
CREATE POLICY "Authenticated delete files" ON storage.objects FOR DELETE USING (bucket_id = 'files');
CREATE POLICY "Authenticated update files" ON storage.objects FOR UPDATE USING (bucket_id = 'files');

-- ─── Seed: Sample Projects ───────────────────────────────────────────────────

INSERT INTO projects (title, slug, description, type, technologies, featured, demo_mode, live_url, github_url)
VALUES
  (
    'Portfolio Platform',
    'portfolio-platform',
    'A fullstack portfolio website built with Expo 55 (React Native Web) and Go/Gin. Features a dynamic public portfolio with hero section, project showcase, resume viewer, and contact form — all content managed through a built-in admin panel backed by Supabase.',
    'web',
    ARRAY['Expo','React Native Web','TypeScript','Go','Gin','Supabase','TanStack Query','Zustand'],
    true,
    false,
    NULL,
    NULL
  ),
  (
    'Mobile Commerce App',
    'mobile-commerce-app',
    'Cross-platform e-commerce app built with React Native and Expo.',
    'mobile',
    ARRAY['React Native','Expo','TypeScript','Redux','Node.js'],
    true,
    false,
    NULL,
    NULL
  ),
  (
    'REST API Gateway',
    'rest-api-gateway',
    'High-performance API gateway built with Go.',
    'backend',
    ARRAY['Go','Gin','PostgreSQL','Redis','Docker','JWT'],
    false,
    false,
    NULL,
    NULL
  )
ON CONFLICT (slug) DO NOTHING;
