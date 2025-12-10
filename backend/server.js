import express from 'express';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Configure CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'College Truth Board API is running' });
});

// --- SUPABASE INIT --- //
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const BUCKET = process.env.SUPABASE_BUCKET || 'collegeass';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- STORAGE HELPER --- //
async function uploadToStorage(file) {
  const ext = file.originalname.split('.').pop();
  const fileName = `uploads/${uuidv4()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file.buffer, { contentType: file.mimetype });

  if (error) throw new Error(error.message);

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

// ==============================
//           POSTS
// ==============================

// CREATE POST
app.post('/api/posts', upload.single('file'), async (req, res) => {
  try {
    const { type, college, caption, body, tags, alias } = req.body;

    if (!type || !['photo', 'video', 'text'].includes(type))
      return res.status(400).json({ error: 'Invalid type' });

    if (!college)
      return res.status(400).json({ error: 'College required' });

    const tagList = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    let mediaUrl = null;

    if ((type === 'photo' || type === 'video') && req.file) {
      mediaUrl = await uploadToStorage(req.file);
    }

    const postAlias = alias || `Anon-${uuidv4().slice(0, 6)}`;

    // Insert Post
    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        type,
        college,
        caption,
        body,
        media_url: mediaUrl,
        tags: tagList,
        alias: postAlias
      })
      .select()
      .single();

    if (error) throw error;

    // Create post_meta row
    await supabase.from('post_meta').insert({ post_id: post.id });

    res.status(201).json(post);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL POSTS
app.get('/api/posts', async (req, res) => {
  try {
    const { search } = req.query;
    let query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    // Client-side filtering for comprehensive search
    if (search) {
      const searchLower = search.toLowerCase();
      const filtered = (data || []).filter(post => {
        // Search in college name
        if (post.college && post.college.toLowerCase().includes(searchLower)) return true;
        // Search in caption
        if (post.caption && post.caption.toLowerCase().includes(searchLower)) return true;
        // Search in body text
        if (post.body && post.body.toLowerCase().includes(searchLower)) return true;
        // Search in tags
        if (post.tags && Array.isArray(post.tags)) {
          return post.tags.some(tag => tag.toLowerCase().includes(searchLower));
        }
        return false;
      });
      res.json(filtered);
    } else {
      res.json(data || []);
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SINGLE POST
app.get('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
//        INTERACTIONS
// ==============================

app.post('/api/posts/:postId/interact', async (req, res) => {
  try {
    const { postId } = req.params;
    const { action_type, comment_text, reason } = req.body;

    if (!['upvote', 'downvote', 'comment', 'report'].includes(action_type))
      return res.status(400).json({ error: 'Invalid action_type' });

    // ---- UPVOTE ---- //
    if (action_type === 'upvote') {
      await supabase.rpc('increment_post_meta', {
        pid: postId,
        col: 'upvotes'
      });
      return res.json({ success: true });
    }

    // ---- DOWNVOTE ---- //
    if (action_type === 'downvote') {
      await supabase.rpc('increment_post_meta', {
        pid: postId,
        col: 'downvotes'
      });
      return res.json({ success: true });
    }

    // ---- REPORT ---- //
    if (action_type === 'report') {
      await supabase.from('reports').insert({
        post_id: postId,
        report_type: reason || 'false',
        report_text: comment_text
      });

      await supabase.rpc('increment_post_meta', {
        pid: postId,
        col: 'reports'
      });

      return res.json({ success: true });
    }

    // ---- COMMENT ---- //
    if (action_type === 'comment') {
      await supabase.from('comments').insert({
        post_id: postId,
        comment_text
      });

      await supabase.rpc('increment_post_meta', {
        pid: postId,
        col: 'comments'
      });

      return res.json({ success: true });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
//  GET INTERACTIONS (META + COMMENTS)
// ==============================

app.get('/api/posts/:postId/interactions', async (req, res) => {
  try {
    const { postId } = req.params;

    // Fetch comments
    const { data: comments } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    // Fetch post_meta
    const { data: meta, error: metaError } = await supabase
      .from('post_meta')
      .select('upvotes, downvotes, comments, reports')
      .eq('post_id', postId)
      .single();

    if (metaError) {
      // If no meta exists, return defaults but keep the actual comments
      return res.json({
        upvotes: 0,
        downvotes: 0,
        comments: comments || [],
        reports: 0
      });
    }

    const responseData = {
      upvotes: meta?.upvotes || 0,
      downvotes: meta?.downvotes || 0,
      comments: comments || [],
      reports: meta?.reports || 0
    };

    console.log(`[GET /interactions/${postId}] Returning:`, responseData);
    res.json(responseData);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
//        SUBMIT REPORT
// ==============================

app.post('/api/posts/:postId/report', upload.single('proof'), async (req, res) => {
  try {
    const { postId } = req.params;
    const { report_type, report_text } = req.body;

    if (!report_type || !['true', 'false'].includes(report_type)) {
      return res.status(400).json({ error: 'report_type must be true or false' });
    }

    let proofUrl = null;
    if (req.file) {
      proofUrl = await uploadToStorage(req.file);
    }

    // Insert report
    const { data: report, error } = await supabase
      .from('reports')
      .insert({
        post_id: postId,
        report_type,
        report_text,
        proof_url: proofUrl
      })
      .select()
      .single();

    if (error) throw error;

    // Increment report count in post_meta
    await supabase.rpc('increment_post_meta', {
      pid: postId,
      col: 'reports'
    });

    res.status(201).json({ success: true, report });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
//        ADMIN ENDPOINTS
// ==============================

// GET ALL REPORTS (Admin)
app.get('/api/admin/reports', async (req, res) => {
  try {
    // 1. Get all reports
    const { data: reports, error: reportsError } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (reportsError) throw reportsError;

    // 2. Enhance reports with post details manually (simulation of join)
    const reportsWithPosts = await Promise.all(reports.map(async (r) => {
      const { data: post } = await supabase
        .from('posts')
        .select('*')
        .eq('id', r.post_id)
        .single();
      return { ...r, post };
    }));

    res.json(reportsWithPosts);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE POST (Admin)
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Manual Cascade Deletion
    // 1. Delete Reports
    await supabase.from('reports').delete().eq('post_id', id);

    // 2. Delete Comments
    await supabase.from('comments').delete().eq('post_id', id);

    // 3. Delete Post Meta
    await supabase.from('post_meta').delete().eq('post_id', id);

    // 4. Finally, Delete Post
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
//        SERVER START
// ==============================

const PORT = process.env.PORT || 8000;

// For local development
if (!process.env.VERCEL) {
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
}

// Export for Vercel and Node.js
module.exports = app;
export default app;
