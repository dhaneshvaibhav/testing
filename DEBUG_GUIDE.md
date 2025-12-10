# Frontend Data Display Debugging Guide

## Quick Check - Open Browser Console

1. Open your browser
2. Press `F12` to open Developer Tools
3. Go to the **Console** tab
4. Refresh the page (F5)
5. Look for these console messages:

### You should see:
```
✓ Component mounted, fetching posts
✓ Fetching posts...
✓ Posts fetched: [...]
✓ Interactions for [post-id-1]: { upvotes: 0, downvotes: 0, comments: [...], reports: 0 }
✓ Interactions for [post-id-2]: { upvotes: 0, downvotes: 0, comments: [...], reports: 0 }
✓ All interactions: { [post-id-1]: {...}, [post-id-2]: {...} }
✓ Interactions state updated: { [post-id-1]: {...}, [post-id-2]: {...} }
```

### If you see errors:
```
❌ Error fetching posts: [error message]
❌ Error fetching interactions for [id]: [error message]
```

---

## Troubleshooting Steps

### Issue 1: "Cannot fetch posts" or 404 errors

**Symptom:** Console shows `Error fetching posts: Failed to fetch` or `HTTP error! status: 404`

**Solution:**
1. Check backend is running: Open `http://localhost:8000/api/posts` in browser
2. Should see JSON array of posts
3. If not, restart backend: `cd backend && npm run dev`

---

### Issue 2: Interactions return empty or zeros

**Symptom:** Console shows posts but all upvotes/downvotes/comments are 0, no comments in array

**Solution:**
1. Check Supabase database directly
2. In Supabase dashboard, go to **Table Editor**
3. Check `posts` table - posts are there
4. Check `post_meta` table - rows exist for each post
5. Check `comments` table - if you added comments, they should be there
6. Verify counts match what's in `post_meta`

---

### Issue 3: Counts show 0 even though database has data

**Symptom:** Post exists in database with upvotes/comments, but frontend shows 0

**Possible causes:**
- `post_meta` row not created when post was created
- POST endpoint has a bug
- API endpoint returns wrong data

**Check:**
1. Open browser DevTools Network tab
2. Click upvote button
3. Look for request to `/api/posts/{id}/interact`
4. Response should be `{ success: true }`
5. Immediately after, look for request to `/api/posts/{id}/interactions`
6. Response should show updated counts like:
```json
{
  "upvotes": 1,
  "downvotes": 0,
  "comments": [],
  "reports": 0
}
```

---

### Issue 4: Comments not showing

**Symptom:** Comment count is correct but comments don't appear in list

**Solution:**
1. Open browser DevTools -> Network tab
2. Add a comment
3. Look at response from `/api/posts/{id}/interactions`
4. Check the `comments` array contains the comment you just added
5. If it's there but not showing, it's a React rendering issue
6. Check console for any React errors (red X symbols)

---

## Data Flow Validation

### When page loads:
```
Frontend mounted
  ↓
fetchPosts() called
  ↓
GET /api/posts → Returns all posts
  ↓
For each post:
  GET /api/posts/{id}/interactions → Returns counts & comments
  ↓
setInteractions(data) → Updates React state
  ↓
Page re-renders with counts
```

### When you click upvote:
```
Click upvote button
  ↓
interact(postId, 'upvote') called
  ↓
POST /api/posts/{id}/interact { action_type: 'upvote' } → { success: true }
  ↓
GET /api/posts/{id}/interactions → Returns updated counts
  ↓
setInteractions(...) → Updates state
  ↓
Component re-renders
  ↓
Count increases by 1
```

---

## Console Commands to Test

In browser console, paste these to test API directly:

### Test 1: Get all posts
```javascript
fetch('http://localhost:8000/api/posts')
  .then(r => r.json())
  .then(d => console.log(d))
```

### Test 2: Get interactions for first post
```javascript
fetch('http://localhost:8000/api/posts/{POST_ID}/interactions')
  .then(r => r.json())
  .then(d => console.log(d))
```
(Replace `{POST_ID}` with actual post ID from posts list)

### Test 3: Upvote a post
```javascript
fetch('http://localhost:8000/api/posts/{POST_ID}/interact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action_type: 'upvote' })
})
.then(r => r.json())
.then(d => console.log(d))
```

### Expected responses:
- Test 1: `[{id, type, college, ...}, ...]`
- Test 2: `{upvotes: 0, downvotes: 0, comments: [], reports: 0}`
- Test 3: `{success: true}`

---

## Network Tab Inspection

1. Open DevTools → **Network** tab
2. Filter by `Fetch/XHR`
3. Perform an action (upvote, comment, etc.)
4. Check requests:
   - `POST /api/posts/{id}/interact` → Response: `{success: true}`
   - `GET /api/posts/{id}/interactions` → Response: Updated counts

If responses look wrong, the issue is in the backend.

---

## React Component State Check

In console, if you know React Developer Tools are installed, you can inspect component state:

1. Open DevTools → **Components** tab
2. Find the `Posts` component
3. Expand it and look for:
   - `posts` state - array of posts
   - `interactions` state - object with post IDs as keys
4. Click a post state object and check:
   ```
   {
     "[POST_ID]": {
       upvotes: number,
       downvotes: number,
       comments: array,
       reports: number
     }
   }
   ```

If `interactions` state is empty `{}` or has wrong structure, that's the problem.

---

## Common Fixes

### 1. Backend not running
```bash
cd backend
npm run dev
```

### 2. Wrong API URL
Check in `post.jsx` line 2:
```javascript
const API_BASE = "http://localhost:8000";
```
Should match your backend port.

### 3. post_meta not created
When creating post, check backend creates `post_meta` row:
```javascript
// In /api/posts endpoint:
await supabase.from('post_meta').insert({ post_id: post.id });
```

### 4. Missing RPC function
In Supabase SQL editor, verify function exists:
```sql
SELECT * FROM pg_proc WHERE proname = 'increment_post_meta';
```

---

## Still Stuck?

1. **Share these console outputs:**
   - Full console log when page loads
   - Network tab screenshots showing requests/responses
   - Database screenshot of `post_meta` table

2. **Run these checks:**
   - Can you see posts in feed? YES / NO
   - Do counts show as 0? YES / NO
   - Does upvote button respond when clicked? YES / NO
   - Check database, does `post_meta` have rows? YES / NO
   - Check database, do `comments` have rows? YES / NO
