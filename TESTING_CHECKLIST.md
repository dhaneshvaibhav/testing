# Testing Checklist

## Database Setup
- [ ] Run SQL schema from `backend/supabase_schema.sql` in Supabase SQL Editor
- [ ] Verify all tables created: `posts`, `post_meta`, `comments`, `reports`
- [ ] Verify RPC function `increment_post_meta` exists
- [ ] Verify storage bucket `collegeass` exists and is public

## Backend Setup
- [ ] Run `cd backend && npm install`
- [ ] Create `.env` file with Supabase credentials
- [ ] Start server: `npm run dev`
- [ ] Server should log: `Server running on http://localhost:8000`

## Frontend Setup
- [ ] Run `cd college/collegescams && npm install`
- [ ] Start dev server: `npm run dev`
- [ ] Frontend should load at `http://localhost:5173`

## Feature Testing

### Create Post
- [ ] Click "+" button
- [ ] Select "Photo/Video/Text"
- [ ] Fill in college name, caption, tags
- [ ] Submit
- [ ] Verify post appears in feed
- [ ] Verify post_meta row created in database with zeros

### Upvote/Downvote
- [ ] Click upvote button on a post
- [ ] Verify upvote count increments by 1 immediately
- [ ] Check database: `post_meta.upvotes` incremented
- [ ] Click downvote button
- [ ] Verify downvote count increments by 1 immediately
- [ ] Check database: `post_meta.downvotes` incremented

### Comments
- [ ] Click comment button to open comment section
- [ ] Type comment and press Enter or click Send
- [ ] Verify comment appears immediately
- [ ] Verify comment count increments
- [ ] Check database: new row in `comments` table
- [ ] Check database: `post_meta.comments` incremented
- [ ] Visit post detail page to verify comments persist

### Reports
- [ ] Click Report button on post
- [ ] Select TRUE or FALSE
- [ ] Enter explanation text
- [ ] (Optional) Upload proof file
- [ ] Click Submit Report
- [ ] Verify success message
- [ ] Check database: new row in `reports` table
- [ ] Check database: `post_meta.reports` incremented

### Real-time Updates
- [ ] Open post in two browser windows
- [ ] Upvote on one window
- [ ] Verify count updates on other window (if you refresh)
- [ ] Add comment on one window
- [ ] Refresh other window and verify comment appears

### Navigation
- [ ] Posts feed displays correctly
- [ ] Click on post card to view post detail
- [ ] Post detail shows full content
- [ ] Back button works correctly
- [ ] Comments show on detail page

## Common Issues & Fixes

### "Invalid foreign key"
- Ensure `post_meta` row is created when post is created
- Check that `post_id` in `post_meta` matches actual post ID

### "Increment function not found"
- Verify RPC function was created in Supabase
- Check function name is exactly `increment_post_meta`

### Comments not showing
- Verify comment count increments when comment is added
- Check that `comments` table has records with correct `post_id`
- Refresh page to see latest comments

### Upvote/Downvote not working
- Check that interaction endpoint is called with correct `action_type`
- Verify backend logs show the request
- Check that RPC function is updating the correct column

### Report not submitting
- Verify `report_type` is either "true" or "false"
- Check that `report_text` field is populated (or at least not causing errors)
- Verify `post_meta.reports` increments after submission
