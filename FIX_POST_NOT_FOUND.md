# Fixing "Post not found" Error

## The Problem
When you click on a post in the feed, you see:
- Page tries to load
- Error: "Post not found" 
- OR: "HTTP 404"
- Page might show nothing or error message

## Root Causes and Solutions

### Cause 1: Backend Not Running

**How to check:**
1. Open browser to `http://localhost:8000/api/posts`
2. You should see JSON array of posts
3. If you see "Cannot reach server" or blank page, backend isn't running

**Fix:**
```bash
cd backend
npm run dev
```

You should see:
```
Server running on http://localhost:8000
```

---

### Cause 2: Wrong Port

**How to check:**
In `college/collegescams/src/pages/post.jsx`, line 2 should be:
```javascript
const API_BASE = "http://localhost:8000";
```

If backend is running on different port (e.g., 8001), this won't work.

**Fix:**
1. Check what port backend is actually running on
2. Update both `post.jsx` line 2 AND `PostDetail.jsx` line 5 to match
3. Restart frontend

---

### Cause 3: Post ID Not in URL

**How to check:**
1. Click a post in the feed
2. Look at address bar
3. Should show: `http://localhost:5173/IIT Delhi/abc123-uuid-here`
4. If you just see `http://localhost:5173/` or no ID, that's the problem

**Fix:**
In `post.jsx` around line 130, verify this line exists:
```jsx
onClick={() => navigate(`/${post.college}/${post.id}`)}
```

If it's missing or wrong, add it back.

---

### Cause 4: URL Route Wrong

**How to check:**
In `App.jsx` line 22, should be:
```jsx
<Route path="/:college/:id" element={<PostDetail />} />
```

**Fix:**
Make sure that exact route exists in App.jsx.

---

### Cause 5: Post ID Format Wrong

**How to check:**
1. Open browser console (F12)
2. Click a post
3. Look for console log: `PostDetail mounted, college: ... id: ...`
4. Note the `id` value
5. Copy it and visit: `http://localhost:8000/api/posts/{ID}` in browser directly
6. If you get JSON, ID is correct
7. If you get error, ID format is wrong

**Fix:**
- IDs should be UUIDs like: `550e8400-e29b-41d4-a716-446655440000`
- If ID looks wrong, check database:
  ```sql
  SELECT id FROM posts LIMIT 1;
  ```
  Copy the actual ID format from database

---

### Cause 6: Post Doesn't Exist

**How to check:**
1. Get the post ID from console log
2. In Supabase dashboard, go to `posts` table
3. Search for that ID
4. If not there, post was never created properly

**Fix:**
1. Create a new post in the UI
2. Check it appears in feed
3. Try clicking it
4. Check console for exact ID
5. Go to Supabase and verify post exists with that ID

---

### Cause 7: CORS Issue

**How to check:**
1. Open browser console (F12)
2. Look for error like: "Access to XMLHttpRequest at 'http://localhost:8000' from origin 'http://localhost:5173' has been blocked by CORS policy"

**Fix:**
Verify backend has CORS enabled. In `backend/server.js` line 11:
```javascript
app.use(cors());
```

If missing, add it.

---

## Step-by-Step Troubleshooting

### Step 1: Verify Backend is Running
```bash
# Terminal 1
cd backend
npm run dev
```
Should show: `Server running on http://localhost:8000`

### Step 2: Verify Frontend is Running
```bash
# Terminal 2
cd college/collegescams
npm run dev
```
Should show: `Local: http://localhost:5173`

### Step 3: Create a Post
1. Go to `http://localhost:5173`
2. Click "+" button
3. Choose text post
4. Fill in college name
5. Click Post

### Step 4: Check Console While Clicking Post
1. Open DevTools (F12)
2. Click Console tab
3. Click on the post you just created
4. Look for messages:
   - ✓ `PostDetail mounted, college: ... id: ...`
   - ✓ `Fetching post with ID: ...`
   - ✓ `Fetch response status: 200`
   - ✓ `Post data: {...}`

### Step 5: If You See Errors
- ✗ `Fetch response status: 404` → Post ID wrong or post doesn't exist
- ✗ `Cannot reach server` → Backend not running
- ✗ `No post ID in URL` → Route not set up correctly

---

## Testing with Direct API Call

In browser console, paste this (replace ID with actual post ID):

```javascript
const postId = 'your-post-uuid-here';
fetch(`http://localhost:8000/api/posts/${postId}`)
  .then(r => {
    console.log('Status:', r.status);
    return r.json();
  })
  .then(d => console.log('Post:', d))
  .catch(e => console.error('Error:', e))
```

Should log the post data.

If it shows 404, post doesn't exist in database.

---

## Quick Fixes Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] Can access `http://localhost:8000/api/posts` in browser (shows JSON)
- [ ] Post exists in database (Supabase posts table)
- [ ] Post ID is UUID format (not empty)
- [ ] Route in App.jsx is `/:college/:id`
- [ ] Navigate link in post.jsx is `/${post.college}/${post.id}`
- [ ] API_BASE in both files is `http://localhost:8000`
- [ ] No CORS errors in console
- [ ] Console shows correct ID when clicking post

---

## Still Not Working?

Share these details:
1. Console log when you click a post (screenshot)
2. URL shown in address bar when you click
3. Error message exactly
4. Result of opening `http://localhost:8000/api/posts` in browser
5. Post ID from database (Supabase)
6. Backend console output when request is made
