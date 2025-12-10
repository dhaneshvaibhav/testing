# College Scams - Implementation Guide

## Overview
This is a fully functional posting website with interactive features including upvotes, downvotes, comments, and reports. All interactions update the database in real-time.

## Database Schema

### 1. **posts** table
Stores the main posts with metadata.
```sql
- id (UUID PRIMARY KEY)
- type (photo/video/text)
- college (TEXT)
- caption (TEXT)
- body (TEXT)
- media_url (TEXT)
- tags (TEXT[])
- alias (Anonymous identifier)
- created_at (TIMESTAMPTZ)
```

### 2. **post_meta** table
Tracks engagement metrics for each post.
```sql
- id (UUID PRIMARY KEY)
- post_id (UUID FOREIGN KEY → posts.id)
- upvotes (INT DEFAULT 0)
- downvotes (INT DEFAULT 0)
- comments (INT DEFAULT 0)
- reports (INT DEFAULT 0)
- created_at (TIMESTAMPTZ)
```

### 3. **comments** table
Stores individual comments on posts.
```sql
- id (UUID PRIMARY KEY)
- post_id (UUID FOREIGN KEY → posts.id)
- comment_text (TEXT)
- alias (TEXT DEFAULT 'Anon')
- created_at (TIMESTAMPTZ)
```

### 4. **reports** table
Stores reports/flags on posts with true/false classification.
```sql
- id (UUID PRIMARY KEY)
- post_id (UUID FOREIGN KEY → posts.id)
- report_type (true/false)
- report_text (TEXT)
- alias (TEXT DEFAULT 'Anon')
- created_at (TIMESTAMPTZ)
```

## Backend API Endpoints

### Posts Management

#### Create Post
```
POST /api/posts
Content-Type: multipart/form-data

Fields:
- type: "photo" | "video" | "text"
- college: "College Name" (required)
- caption: "Post caption" (optional)
- body: "Text content" (for type="text")
- tags: "tag1, tag2, tag3" (comma-separated)
- alias: "Poster alias" (optional, defaults to "Anon-{random}")
- file: <File> (for photo/video types)

Response: { id, type, college, caption, body, media_url, tags, alias, created_at }
```

#### Get All Posts
```
GET /api/posts?limit=50

Response: [{ id, type, college, caption, body, media_url, tags, alias, created_at }, ...]
```

#### Get Single Post
```
GET /api/posts/{postId}

Response: { id, type, college, caption, body, media_url, tags, alias, created_at }
```

### Interactions

#### Get Post Interactions (Counts & Comments)
```
GET /api/posts/{postId}/interactions

Response:
{
  upvotes: 5,
  downvotes: 2,
  comments: [
    { id, post_id, comment_text, alias, created_at },
    ...
  ],
  reports: 1
}
```

#### Upvote/Downvote/Comment
```
POST /api/posts/{postId}/interact
Content-Type: application/json

Body:
{
  action_type: "upvote" | "downvote" | "comment",
  comment_text: "Optional comment" (required if action_type="comment")
}

Response: { success: true }
```

**How it works:**
1. When `action_type="upvote"` → Increments `post_meta.upvotes` by 1
2. When `action_type="downvote"` → Increments `post_meta.downvotes` by 1
3. When `action_type="comment"` → 
   - Inserts new record in `comments` table
   - Increments `post_meta.comments` by 1

#### Submit Report
```
POST /api/posts/{postId}/report
Content-Type: multipart/form-data

Fields:
- report_type: "true" | "false" (required)
- report_text: "Explanation..." (optional)
- proof: <File> (optional)

Response: { success: true, report: {...} }
```

**How it works:**
1. Inserts new record in `reports` table with the report_type and text
2. Increments `post_meta.reports` by 1

## Frontend Implementation

### Post Feed (post.jsx)
- Displays all posts with engagement metrics
- Shows upvote/downvote counts in real-time
- Shows comment count
- Can toggle comment section to view/add comments
- Can submit reports via modal

### Post Detail (PostDetail.jsx)
- Shows full post with all details
- Displays upvote/downvote counts
- Shows comment section with all comments
- Can add comments directly
- Can submit detailed reports

## Flow Diagram

```
User Creates Post
    ↓
POST /api/posts
    ↓
post_meta row created with zeros
    ↓
Post appears in feed

---

User Upvotes/Downvotes
    ↓
POST /api/interact (upvote/downvote)
    ↓
RPC function increments post_meta column
    ↓
GET /api/posts/:id/interactions fetches updated count
    ↓
UI updates with new count (real-time)

---

User Adds Comment
    ↓
POST /api/interact (comment)
    ↓
Comment inserted in comments table
    ↓
post_meta.comments incremented
    ↓
GET /api/posts/:id/interactions fetches updated comments
    ↓
UI displays new comment (real-time)

---

User Submits Report
    ↓
POST /api/posts/:id/report
    ↓
Report inserted in reports table
    ↓
post_meta.reports incremented
    ↓
GET /api/posts/:id/interactions fetches updated count
    ↓
UI updates report count
```

## Setup Instructions

### 1. Run SQL Schema in Supabase
Copy the entire content of `backend/supabase_schema.sql` and paste into Supabase SQL Editor to create all tables and RPC function.

### 2. Configure Backend
```bash
cd backend
npm install
```

Create `.env` file:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_BUCKET=collegeass
PORT=8000
```

Start server:
```bash
npm run dev
```

### 3. Configure Frontend
```bash
cd college/collegescams
npm install
npm run dev
```

Visit `http://localhost:5173` (or whatever port Vite assigns)

## Key Features

✅ **Fully Anonymous** - All posts are anonymous by default
✅ **Real-time Interactions** - Counts update instantly
✅ **Type Support** - Photo, video, and text posts
✅ **Comments** - Full commenting system with timestamps
✅ **Reporting** - Submit reports with true/false classification
✅ **Engagement Tracking** - Tracks upvotes, downvotes, comments, and reports
✅ **Tags** - Posts can have multiple tags
✅ **File Upload** - Supports image and video uploads to Supabase Storage

## Notes

- All interactions are anonymous (no user tracking)
- Comments default to "Anon" alias unless specified
- Reports can be true/false to indicate if post is factual or not
- Engagement counts increment immediately on database operations
- All data is properly indexed for fast queries
