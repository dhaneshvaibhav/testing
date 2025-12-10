import express from 'express';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const BUCKET = process.env.SUPABASE_BUCKET || 'collegeass';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Upload helper
async function uploadToStorage(file) {
  const ext = file.originalname.split('.').pop();
  const fileName = `uploads/${uuidv4()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(fileName, file.buffer, { contentType: file.mimetype });
  if (error) throw new Error(error.message);

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return urlData.publicUrl;
}

// --- POSTS --- //
// Create Post
app.post('/api/posts', upload.single('file'), async (req, res) => {
  try {
    const { type, college, caption, body, tags, alias } = req.body;
    if (!type || !['photo', 'video', 'text'].includes(type)) return res.status(400).json({ error: 'Invalid type' });
    if (!college) return res.status(400).json({ error: 'College required' });

    const tagList = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    let mediaUrl = null;
    if ((type === 'photo' || type === 'video') && req.file) {
      mediaUrl = await uploadToStorage(req.file);
    }
    const postAlias = alias || `Anon-${uuidv4().slice(0, 6)}`;

    const { data, error } = await supabase
      .from('posts')
      .insert({ type, college, caption, body, media_url: mediaUrl, tags: tagList, alias: postAlias })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single post
app.get('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- INTERACTIONS --- //
// Get interactions summary for a post
app.get('/api/posts/:postId/interactions', async (req, res) => {
  try {
    const { postId } = req.params;
    const { data, error } = await supabase.from('post_interactions').select('*').eq('post_id', postId);
    if (error) throw error;

    const summary = {
      likes: data.filter(i => i.action_type === 'like').length,
      dislikes: data.filter(i => i.action_type === 'dislike').length,
      agrees: data.filter(i => i.action_type === 'agree').length,
      disagrees: data.filter(i => i.action_type === 'disagree').length,
      shares: data.filter(i => i.action_type === 'share').length,
      comments: data.filter(i => i.action_type === 'comment'),
    };
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add interaction (like, comment, etc.)
app.post('/api/posts/:postId/interact', async (req, res) => {
  try {
    const { postId } = req.params;
    const { action_type, comment_text, user_id } = req.body;

    if (!['like', 'dislike', 'agree', 'disagree', 'share', 'comment'].includes(action_type))
      return res.status(400).json({ error: 'Invalid action_type' });

    const { data, error } = await supabase
      .from('post_interactions')
      .insert({ post_id: postId, action_type, comment_text: comment_text || null, user_id })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
