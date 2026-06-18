-- Add slug and markdown content to projects
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS content TEXT;

-- Backfill slugs for existing projects from their title
UPDATE projects
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(TRIM(title), '[^a-zA-Z0-9\s]', '', 'g'),
    '\s+', '-', 'g'
  )
)
WHERE slug IS NULL;
