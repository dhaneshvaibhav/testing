# Quick Start Guide

## 5-Minute Setup

### Step 1: Run Database Schema (1 min)
1. Open Supabase dashboard
2. Go to SQL Editor
3. Copy entire content from `backend/supabase_schema.sql`
4. Paste in Supabase SQL Editor
5. Click "Run"
✅ All tables and RPC function created

### Step 2: Start Backend (2 min)
```bash
cd backend
npm install
```

Create `.env` file:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_BUCKET=collegeass
PORT=8000
```

Start server:
```bash
npm run dev
```

You should see:
```
Server running on http://localhost:8000
```

### Step 3: Start Frontend (2 min)
```bash
cd college/collegescams
npm install
npm run dev
```

You should see:
```
Local:   http://localhost:5173
```

Open that URL in browser.

---

## Basic Usage

### Create a Post
1. Click **+** button (bottom right)
2. Choose **Photo**, **Video**, or **Text**
3. Fill in:
   - College name (required)
   - Caption (optional)
   - Tags (optional)
4. Click **Post**

### Upvote/Downvote
1. Find post in feed
2. Click **⬆️** to upvote (green)
3. Click **⬇️** to downvote (red)
4. Count updates instantly

### Comment
1. Click comment icon on post
2. Comment section opens
3. Type comment
4. Press Enter or click Send
5. Comment appears with timestamp

### Report
1. Click **Report** button
2. Select **TRUE** or **FALSE**
3. Add explanation
4. (Optional) Upload proof
5. Click **Submit Report**

---

## What's Working

✅ Create posts (photo/video/text)
✅ Upload files to Supabase Storage
✅ Real-time upvote/downvote counting
✅ Comments with timestamps
✅ Comment counting
✅ Report submission with true/false classification
✅ All counts update in database
✅ All interactions are anonymous
✅ Full post detail view
✅ Comment section on detail page

---

## Troubleshooting

### Backend won't start
```
Error: SUPABASE_URL is not defined
```
→ Make sure `.env` file exists in `backend` folder

### Frontend shows "Cannot fetch posts"
```
GET http://localhost:8000/api/posts 404 (Not Found)
```
→ Backend server not running. Run `npm run dev` in backend folder

### Posts don't appear
→ Check browser console for errors
→ Check backend logs for SQL errors
→ Verify post_meta table was created

### Counts don't update
→ Check that interaction endpoint returns `{ success: true }`
→ Verify post_meta row exists for that post
→ Check browser network tab to see response

### Comments not showing
→ Refresh page to reload comments
→ Check that comment was inserted in database
→ Verify comments are fetched on each refresh

---

## API Endpoints Quick Reference

```
POST   /api/posts                    Create post
GET    /api/posts                    List all posts
GET    /api/posts/{id}               Get single post

POST   /api/posts/{id}/interact      Upvote/Downvote/Comment
  Body: { 
    action_type: "upvote"|"downvote"|"comment",
    comment_text: "text" (if comment)
  }

GET    /api/posts/{id}/interactions  Get counts & comments
  Response: {
    upvotes: 5,
    downvotes: 2,
    comments: [...],
    reports: 1
  }

POST   /api/posts/{id}/report        Submit report
  Body: {
    report_type: "true"|"false",
    report_text: "explanation"
  }
```

---

## Database Structure Quick View

```
posts
├── id, type, college, caption, body, media_url, tags, alias, created_at

post_meta (1 per post)
├── post_id → posts.id
├── upvotes, downvotes, comments, reports (all INT, default 0)

comments (many per post)
├── post_id → posts.id
├── comment_text, alias, created_at

reports (many per post)
├── post_id → posts.id
├── report_type (true/false), report_text, alias, created_at
```

---

## File Organization

```
backend/
├── server.js              ← Main API server
├── supabase_schema.sql    ← Database schema (run in Supabase)
├── package.json
└── .env                   ← Your credentials (not in git)

college/collegescams/
├── src/
│   ├── pages/
│   │   ├── post.jsx       ← Feed/list page
│   │   ├── PostDetail.jsx ← Single post page
│   │   ├── createpostmodal.jsx ← Create post form
│   │   └── startingpage.jsx ← Home/info page
│   ├── components/
│   │   └── Navbar.jsx
│   ├── App.jsx
│   └── index.css
└── package.json

Documentation/
├── IMPLEMENTATION_GUIDE.md  ← Full API docs
├── TESTING_CHECKLIST.md     ← Testing procedures
└── CHANGES_SUMMARY.md       ← What was changed
```

---

## Common Next Steps

After verifying everything works:

1. **Deploy Backend** → Use Vercel, Railway, or your favorite hosting
2. **Deploy Frontend** → Use Vercel, Netlify, or GitHub Pages
3. **Add Authentication** → Prevent duplicate upvotes (optional)
4. **Enable Trending** → Sort by votes (optional)
5. **Add Moderation** → Review reports (optional)

---

For detailed documentation, see `IMPLEMENTATION_GUIDE.md`
For testing procedures, see `TESTING_CHECKLIST.md`
For changes made, see `CHANGES_SUMMARY.md`
