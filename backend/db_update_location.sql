-- Run this in your Supabase SQL Editor

ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS location_city TEXT,
ADD COLUMN IF NOT EXISTS location_state TEXT;

-- Create index for faster location filtering
CREATE INDEX IF NOT EXISTS idx_posts_location_city ON posts(location_city);
CREATE INDEX IF NOT EXISTS idx_posts_location_state ON posts(location_state);
