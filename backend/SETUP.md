# Supabase Setup Guide

## 1. Create the Posts Table

Go to your Supabase dashboard → SQL Editor and run this:

```sql
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
```

## 2. Storage Bucket Setup

**Option A: Auto-create (Recommended)**
- The backend will automatically create the `media` bucket when it starts
- Just run `npm start` and it will handle it

**Option B: Manual Creation**
If you prefer to create it manually in Supabase dashboard:

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Name: `media`
4. **Public bucket**: ✅ Check this (so images/videos are publicly accessible)
5. Click **Create bucket**

## 3. Bucket Policies (if created manually)

If you created the bucket manually, make sure these policies exist:

```sql
-- Allow public read access to storage
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'media');

-- Allow authenticated/anonymous uploads
CREATE POLICY "Allow uploads" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'media');
```

## 4. Verify Setup

After running the SQL and starting your backend:

1. Check the table exists: Go to **Table Editor** → you should see `posts`
2. Check the bucket exists: Go to **Storage** → you should see `media` bucket
3. Test the API: `GET http://localhost:8000/api/health` should return `{"status":"ok"}`

## Table Schema Details

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, auto-generated |
| `type` | TEXT | Must be 'photo', 'video', or 'text' |
| `college` | TEXT | College name (required) |
| `caption` | TEXT | Optional caption for photo/video posts |
| `body` | TEXT | Text content for text posts |
| `media_url` | TEXT | URL to uploaded file (for photo/video) |
| `tags` | TEXT[] | Array of tags |
| `alias` | TEXT | Anonymous alias for the poster |
| `created_at` | TIMESTAMPTZ | Auto-set timestamp |


