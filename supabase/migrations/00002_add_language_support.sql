-- Add language preference to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS preferred_language TEXT NOT NULL DEFAULT 'en'
CHECK (preferred_language IN ('en', 'zh'));

-- Add detected language to ai_conversations
ALTER TABLE ai_conversations
ADD COLUMN IF NOT EXISTS detected_language TEXT;

-- Backfill existing rows
UPDATE profiles
SET preferred_language = 'en'
WHERE preferred_language IS NULL;
