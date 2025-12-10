# Backend API Response Verification

## Test Each Endpoint Manually

### Step 1: Get All Posts
**URL:** `GET http://localhost:8000/api/posts`

**Expected Response:**
```json
[
  {
    "id": "some-uuid",
    "type": "text",
    "college": "IIT Delhi",
    "caption": "My Post",
    "body": "Some text",
    "media_url": null,
    "tags": ["tag1", "tag2"],
    "alias": "Anon-abc123",
    "created_at": "2025-12-11T10:30:00+00:00"
  }
]
```

**How to test:**
- Open browser and visit: `http://localhost:8000/api/posts`
- Should see JSON array
- Copy one `id` value for next test

---

### Step 2: Get Interactions for a Post
**URL:** `GET http://localhost:8000/api/posts/{POST_ID}/interactions`

**Replace `{POST_ID}` with actual ID from Step 1**

**Expected Response:**
```json
{
  "upvotes": 0,
  "downvotes": 0,
  "comments": [],
  "reports": 0
}
```

**After adding comments, expected response:**
```json
{
  "upvotes": 0,
  "downvotes": 0,
  "comments": [
    {
      "id": "comment-uuid",
      "post_id": "post-uuid",
      "comment_text": "Great post!",
      "alias": "Anon",
      "created_at": "2025-12-11T10:35:00+00:00"
    }
  ],
  "reports": 0
}
```

**How to test:**
1. Open browser and visit: `http://localhost:8000/api/posts/{POST_ID}/interactions`
2. Should see JSON with counts
3. Add a comment from frontend and refresh
4. Should see comment in the `comments` array

---

### Step 3: Upvote/Downvote a Post
**URL:** `POST http://localhost:8000/api/posts/{POST_ID}/interact`

**Body:**
```json
{
  "action_type": "upvote"
}
```

**Expected Response:**
```json
{
  "success": true
}
```

**How to test (using curl or Postman):**
```bash
curl -X POST http://localhost:8000/api/posts/{POST_ID}/interact \
  -H "Content-Type: application/json" \
  -d '{"action_type":"upvote"}'
```

**After upvote, check Step 2 again:**
- `upvotes` should be 1

---

### Step 4: Add a Comment
**URL:** `POST http://localhost:8000/api/posts/{POST_ID}/interact`

**Body:**
```json
{
  "action_type": "comment",
  "comment_text": "This is a test comment"
}
```

**Expected Response:**
```json
{
  "success": true
}
```

**How to test:**
```bash
curl -X POST http://localhost:8000/api/posts/{POST_ID}/interact \
  -H "Content-Type: application/json" \
  -d '{"action_type":"comment","comment_text":"This is a test comment"}'
```

**After comment, check Step 2 again:**
- `comments` array should have 1 comment
- Comment should have `comment_text`, `created_at`, etc.

---

### Step 5: Submit a Report
**URL:** `POST http://localhost:8000/api/posts/{POST_ID}/report`

**Body (form-data):**
```
report_type: "true"
report_text: "This post is accurate"
proof: (optional file)
```

**Expected Response:**
```json
{
  "success": true,
  "report": {
    "id": "report-uuid",
    "post_id": "post-uuid",
    "report_type": "true",
    "report_text": "This post is accurate",
    "alias": "Anon",
    "created_at": "2025-12-11T10:40:00+00:00"
  }
}
```

---

## Check These in Backend Logs

When backend is running, you should see console output like:

```
Server running on http://localhost:8000
```

When you make requests, you should see (if you added logging):
```
POST /api/posts/interact received
Comment inserted successfully
post_meta incremented
```

If there are errors:
```
Error: Cannot find table 'post_meta'
Error: RPC function 'increment_post_meta' not found
```

---

## Database Verification

### Check posts table exists and has data
```sql
SELECT id, type, college, alias, created_at FROM posts LIMIT 5;
```
Should return posts you created.

### Check post_meta table exists and is created
```sql
SELECT post_id, upvotes, downvotes, comments, reports FROM post_meta LIMIT 5;
```
Should return one row per post, all starting with 0,0,0,0.

### Check comments are inserted
```sql
SELECT id, post_id, comment_text, created_at FROM comments LIMIT 5;
```
Should return comments you added.

### Check reports are inserted
```sql
SELECT id, post_id, report_type, report_text FROM reports LIMIT 5;
```
Should return reports you submitted.

### Check RPC function exists
```sql
SELECT * FROM pg_proc WHERE proname = 'increment_post_meta';
```
Should return 1 row.

### Test RPC function manually
```sql
SELECT increment_post_meta('YOUR-POST-UUID', 'upvotes');
SELECT * FROM post_meta WHERE post_id = 'YOUR-POST-UUID';
```
`upvotes` column should increase by 1.

---

## If Backend Responses Are Wrong

### Issue: Getting 404 on `/api/posts/{id}/interactions`
**Check:**
- POST exists in database
- POST_ID is correct UUID format
- Backend is running on correct port

**Fix:**
- Restart backend: `cd backend && npm run dev`
- Check server console for error messages

### Issue: Getting empty comments array but comments exist in DB
**Check:**
- Query directly: `SELECT * FROM comments WHERE post_id = '...'`
- Comments should exist with correct post_id
- Check `order by created_at DESC` is working

**Fix:**
- Verify comments table has data
- Check post_id matches exactly (UUID format)
- Restart backend and try again

### Issue: Getting error "RPC function not found"
**Check:**
- Function exists in Supabase: `SELECT proname FROM pg_proc WHERE proname = 'increment_post_meta'`
- Function has correct parameters

**Fix:**
- Copy entire RPC function from `supabase_schema.sql`
- Run in Supabase SQL editor
- Restart backend

### Issue: post_meta row not created on POST
**Check:**
- Backend code has: `await supabase.from('post_meta').insert({ post_id: post.id });`
- No errors during insert
- Verify table exists and has correct schema

**Fix:**
- Manually create post_meta row: 
  ```sql
  INSERT INTO post_meta (post_id) VALUES ('POST-UUID');
  ```
- Check backend logs for errors
- Restart backend

---

## Quick API Test Script

Save this as `test-api.js` and run with `node test-api.js`:

```javascript
const API_BASE = "http://localhost:8000";

async function test() {
  try {
    console.log("1. Getting all posts...");
    let res = await fetch(`${API_BASE}/api/posts`);
    let posts = await res.json();
    console.log(`✓ Got ${posts.length} posts`);
    
    if (posts.length === 0) {
      console.log("❌ No posts found. Create one first.");
      return;
    }
    
    const postId = posts[0].id;
    console.log(`\n2. Getting interactions for post ${postId}...`);
    res = await fetch(`${API_BASE}/api/posts/${postId}/interactions`);
    let inter = await res.json();
    console.log(`✓ Interactions:`, inter);
    
    console.log(`\n3. Upvoting post...`);
    res = await fetch(`${API_BASE}/api/posts/${postId}/interact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type: "upvote" })
    });
    let result = await res.json();
    console.log(`✓ Result:`, result);
    
    console.log(`\n4. Checking updated interactions...`);
    res = await fetch(`${API_BASE}/api/posts/${postId}/interactions`);
    inter = await res.json();
    console.log(`✓ Upvotes should be ${inter.upvotes + 1}... was ${inter.upvotes}... wait let me check`);
    
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

test();
```

---

## Summary Checklist

- [ ] Backend running on port 8000
- [ ] Can access `http://localhost:8000/api/posts`
- [ ] Get response with posts array
- [ ] Can get `/api/posts/{id}/interactions` 
- [ ] Get response with counts and comments array
- [ ] Can POST to `/api/posts/{id}/interact` with upvote
- [ ] Response is `{success: true}`
- [ ] Counts increase when checked again
- [ ] post_meta table exists in Supabase
- [ ] comments table exists in Supabase
- [ ] RPC function `increment_post_meta` exists
- [ ] Database shows inserted data matching counts
