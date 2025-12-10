# College Truth Board - Backend API

Node.js backend with Express for handling posts (photo/video/text) and storing them in Supabase.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the `backend` folder:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_BUCKET=collegeass
PORT=8000
```

3. Make sure your Supabase project has:
   - A `posts` table with columns: `id`, `type`, `college`, `caption`, `body`, `media_url`, `tags`, `alias`, `created_at`
   - A storage bucket named `collegeass` (or set `SUPABASE_BUCKET` to match your bucket name)

## Run

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:8000`

## API Endpoints

- `POST /api/posts` - Create a new post (multipart/form-data)
  - Fields: `type` (photo/video/text), `college`, `caption` (optional), `body` (for text), `tags` (comma-separated), `alias` (optional), `file` (for photo/video)
  
- `GET /api/posts?limit=50` - List all posts (default limit: 50)

- `GET /api/health` - Health check

