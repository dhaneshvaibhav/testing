-- ==============================
--           POSTS TABLE
-- ==============================

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

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_college ON posts(college);
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read posts
CREATE POLICY "Allow public read access" ON posts
  FOR SELECT
  USING (true);

-- Policy: Allow anyone to insert posts
CREATE POLICY "Allow public insert access" ON posts
  FOR INSERT
  WITH CHECK (true);

-- ==============================
--        POST_META TABLE
-- ==============================

CREATE TABLE IF NOT EXISTS post_meta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID UNIQUE NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  comments INT DEFAULT 0,
  reports INT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for post_meta
CREATE INDEX IF NOT EXISTS idx_post_meta_post_id ON post_meta(post_id);

-- Enable RLS on post_meta
ALTER TABLE post_meta ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
CREATE POLICY "Allow public read post_meta" ON post_meta
  FOR SELECT
  USING (true);

-- Policy: Allow public insert/update
CREATE POLICY "Allow public insert post_meta" ON post_meta
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update post_meta" ON post_meta
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ==============================
--       COMMENTS TABLE
-- ==============================

CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  
  comment_text TEXT NOT NULL,
  alias TEXT DEFAULT 'Anon',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for comments
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Enable RLS on comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read comments
CREATE POLICY "Allow public read comments" ON comments
  FOR SELECT
  USING (true);

-- Policy: Allow public insert comments
CREATE POLICY "Allow public insert comments" ON comments
  FOR INSERT
  WITH CHECK (true);

-- ==============================
--       REPORTS TABLE
-- ==============================

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  
  report_type TEXT CHECK (report_type IN ('true', 'false')),
  report_text TEXT,
  proof_url TEXT,
  alias TEXT DEFAULT 'Anon',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for reports
CREATE INDEX IF NOT EXISTS idx_reports_post_id ON reports(post_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

-- Enable RLS on reports
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read reports
CREATE POLICY "Allow public read reports" ON reports
  FOR SELECT
  USING (true);

-- Policy: Allow public insert reports
CREATE POLICY "Allow public insert reports" ON reports
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow public delete reports
CREATE POLICY "Allow public delete reports" ON reports
  FOR DELETE
  USING (true);

-- ==============================
--       POST DELETION POLICIES
-- ==============================

CREATE POLICY "Allow public delete posts" ON posts
  FOR DELETE
  USING (true);

CREATE POLICY "Allow public delete post_meta" ON post_meta
  FOR DELETE
  USING (true);

CREATE POLICY "Allow public delete comments" ON comments
  FOR DELETE
  USING (true);

-- ==============================
--       RPC FUNCTION
-- ==============================

-- Function to increment post_meta columns
CREATE OR REPLACE FUNCTION increment_post_meta(pid UUID, col TEXT)
RETURNS VOID AS $$
BEGIN
  IF col = 'upvotes' THEN
    UPDATE post_meta SET upvotes = upvotes + 1 WHERE post_id = pid;
  ELSIF col = 'downvotes' THEN
    UPDATE post_meta SET downvotes = downvotes + 1 WHERE post_id = pid;
  ELSIF col = 'comments' THEN
    UPDATE post_meta SET comments = comments + 1 WHERE post_id = pid;
  ELSIF col = 'reports' THEN
    UPDATE post_meta SET reports = reports + 1 WHERE post_id = pid;
  END IF;
END;
$$ LANGUAGE plpgsql;


