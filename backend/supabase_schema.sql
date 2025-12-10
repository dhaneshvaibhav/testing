-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('photo', 'video', 'text')),
  college TEXT NOT NULL,
  caption TEXT,
  body TEXT,
  media_url TEXT,
  tags TEXT[] DEFAULT '{}',
  alias TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_college ON posts(college);
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);

-- Enable Row Level Security (RLS) - optional, adjust as needed
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read posts
CREATE POLICY "Allow public read access" ON posts
  FOR SELECT
  USING (true);

-- Policy: Allow anyone to insert posts
CREATE POLICY "Allow public insert access" ON posts
  FOR INSERT
  WITH CHECK (true);

-- Note: If you want to allow updates/deletes, add policies for those too
-- For now, we're keeping it read-only after insert (anonymous posts)


