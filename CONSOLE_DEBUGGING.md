# How to See Console Logs and Debug Frontend

## Opening Browser Developer Tools

### Chrome / Edge / Brave
1. Press `F12` key
2. Or right-click anywhere on page → **Inspect**
3. Click the **Console** tab at the top

### Firefox
1. Press `F12` key
2. Or right-click anywhere on page → **Inspect**
3. Click the **Console** tab at the top

### Safari
1. Enable Developer Menu first:
   - Safari → Preferences → Advanced → Check "Show Develop menu"
2. Press `Cmd + Option + I`
3. Click **Console** tab

---

## What You Should See After Page Loads

When you load the page with the feed, the console should show:

```
Component mounted, fetching posts
Fetching posts...
Posts fetched: (Array) [
  0: {id: "...", type: "text", college: "IIT Delhi", ...}
  1: {id: "...", type: "photo", college: "Delhi University", ...}
  ...
]
Interactions for abc123: 
  ↳ {upvotes: 0, downvotes: 0, comments: Array(0), reports: 0}
Interactions for def456:
  ↳ {upvotes: 2, downvotes: 1, comments: Array(1), reports: 0}
...
All interactions: {abc123: {...}, def456: {...}, ...}
Interactions state updated: {abc123: {...}, def456: {...}, ...}
```

---

## What Each Log Message Means

| Message | What it means |
|---------|---------------|
| `Component mounted, fetching posts` | Page loaded, starting to fetch data |
| `Fetching posts...` | Making request to `/api/posts` |
| `Posts fetched: [...]` | Got response from backend with posts array |
| `Interactions for [id]:` | Got interactions for one post |
| `Error fetching interactions` | ❌ Problem getting counts/comments for a post |
| `All interactions: {...}` | Successfully got interactions for all posts |
| `Interactions state updated:` | React state updated, page should now display data |

---

## If You See Error Messages

### Error 1: "Fetch failed" or "NetworkError"
```
Error fetching posts: NetworkError when attempting to fetch resource.
```

**Causes:**
- Backend not running
- Wrong URL/port
- CORS issue

**Fix:**
1. Check backend is running: `npm run dev` in backend folder
2. Check URL is correct: Should be `http://localhost:8000`
3. Restart both backend and frontend

---

### Error 2: "404 Not Found"
```
Error fetching posts: HTTP error! status: 404
```

**Causes:**
- Backend not running
- Wrong API endpoint

**Fix:**
1. Visit `http://localhost:8000/api/posts` in browser directly
2. Should see JSON array
3. If not, restart backend

---

### Error 3: "SyntaxError: Unexpected token"
```
Error: SyntaxError: Unexpected token < in JSON at position 0
```

**Causes:**
- Backend returned HTML (error page) instead of JSON
- Backend crashed

**Fix:**
1. Check backend console for errors
2. Restart backend: `npm run dev`
3. Check database connection

---

## Testing with Console Commands

You can paste JavaScript directly into console to test:

### Test 1: Get posts
```javascript
fetch('http://localhost:8000/api/posts')
  .then(r => r.json())
  .then(d => { console.log('Posts:', d); console.log('Count:', d.length); })
  .catch(e => console.error('Error:', e))
```

Press Enter and you should see posts logged.

### Test 2: Get interactions for a post
Copy a post ID from test 1, then:
```javascript
const postId = 'abc123'; // Replace with actual ID
fetch(`http://localhost:8000/api/posts/${postId}/interactions`)
  .then(r => r.json())
  .then(d => console.log('Interactions:', d))
  .catch(e => console.error('Error:', e))
```

Should show:
```javascript
{upvotes: 0, downvotes: 0, comments: Array(0), reports: 0}
```

### Test 3: Upvote a post
```javascript
const postId = 'abc123'; // Replace with actual ID
fetch(`http://localhost:8000/api/posts/${postId}/interact`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action_type: 'upvote' })
})
  .then(r => r.json())
  .then(d => console.log('Result:', d))
  .catch(e => console.error('Error:', e))
```

Should show:
```javascript
{success: true}
```

---

## Network Tab - See Actual API Calls

1. Open DevTools (F12)
2. Click **Network** tab
3. Select **Fetch/XHR** filter
4. Reload page (F5)

You should see requests like:

```
GET   /api/posts                        Status: 200
GET   /api/posts/abc123/interactions    Status: 200
GET   /api/posts/def456/interactions    Status: 200
...
```

Click each request to see:
- **Request:** What was sent
- **Response:** What backend returned

### For interactions request, Response should be:
```json
{
  "upvotes": 0,
  "downvotes": 0,
  "comments": [],
  "reports": 0
}
```

If it's different or empty, that's your problem!

---

## Filter Console to See Only Errors

At the top of Console tab, click the filter icon.
Select only **Errors**.

Now you'll only see red error messages, making it easier to spot problems.

---

## Check React Component State (With React DevTools)

1. Install [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/) extension
2. Open DevTools (F12)
3. Click **Components** tab (appears after installing extension)
4. Find `Posts` component on left side
5. Click it
6. On right side, look at `hooks` section
7. Find `State (posts)` and `State (interactions)`
8. Expand `interactions` to see structure

Should look like:
```javascript
{
  "abc123": {
    upvotes: 0,
    downvotes: 0,
    comments: [],
    reports: 0
  },
  "def456": {
    upvotes: 2,
    downvotes: 1,
    comments: [{id: "...", comment_text: "...", ...}],
    reports: 0
  }
}
```

If `interactions` is empty `{}` or has wrong structure, that's why data doesn't show!

---

## Step-by-Step Debugging Process

### Step 1: Open Console
- Press F12
- Click Console tab
- Clear any existing logs with the trash icon

### Step 2: Reload Page
- Press F5 to refresh page
- Watch console for messages

### Step 3: Check for Errors
- Look for red error messages
- Note the exact error text

### Step 4: Test API Directly
- Paste one of the test commands above
- See if you get data
- Note the response

### Step 5: Check Network Requests
- Click Network tab
- Look for 404 or other error statuses
- Click request to see response

### Step 6: Click a Button and Watch
- Click upvote button
- Watch Network tab for POST request
- Check response is `{success: true}`
- Check console for updated interactions

### Step 7: Report Your Findings
If you can't figure it out, share:
1. Full console log text (screenshot)
2. Network tab request/response (screenshot)
3. React component state (screenshot)
4. Error message exactly as written

---

## Common Console Issues and Fixes

| Issue | Fix |
|-------|-----|
| No console logs at all | Reload page (F5), make sure Console tab is selected |
| Lots of unrelated warnings | Click filter icon, select only "Errors" |
| Can't find "Errors" filter | Make sure you're in Console tab, not Issues tab |
| Console is grayed out | Make sure you're on the correct tab/page |
| Logs disappear when you click | They're still there, scroll up in console |

---

## Quick Reference

| Need | Action |
|------|--------|
| Open DevTools | Press F12 |
| Clear console | Trash icon or `clear()` command |
| Copy log text | Right-click → Copy |
| Toggle DevTools | F12 or Ctrl+Shift+I |
| Filter by errors | Click filter icon → select "Errors" |
| Search console | Ctrl+F |
| See post state | Use React DevTools → Components tab |

---

## Still Not Working?

Share these screenshots with your developer:
1. **Console tab** - full console output
2. **Network tab** - request/response for `/api/posts` and `/api/posts/*/interactions`
3. **React DevTools** - state of `interactions` variable
4. **Supabase dashboard** - row count in post_meta, comments, reports tables
5. **Error message** - exact error text from console (red message)

This will help quickly identify where the problem is!
