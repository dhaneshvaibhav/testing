const API_BASE = 'http://localhost:8000';

async function test() {
  console.log('1. Getting all posts...');
  const res1 = await fetch(`${API_BASE}/api/posts`);
  const posts = await res1.json();
  console.log('Posts:', posts);
  
  if (posts.length > 0) {
    const postId = posts[0].id;
    console.log(`\n2. Getting interactions for post ${postId}...`);
    const res2 = await fetch(`${API_BASE}/api/posts/${postId}/interactions`);
    const interactions = await res2.json();
    console.log('Interactions:', interactions);
    
    console.log(`\n3. Upvoting post ${postId}...`);
    const res3 = await fetch(`${API_BASE}/api/posts/${postId}/interact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type: 'upvote' }),
    });
    const result = await res3.json();
    console.log('Result:', result);
    
    console.log(`\n4. Checking updated interactions...`);
    const res4 = await fetch(`${API_BASE}/api/posts/${postId}/interactions`);
    const updated = await res4.json();
    console.log('Updated interactions:', updated);
  }
}

test().catch(console.error);
