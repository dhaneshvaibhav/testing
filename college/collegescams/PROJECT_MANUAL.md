# 🦅 College Truth Board (CollegAeSS) - Project Manual

## 📖 Introduction
**College Truth Board** is an anonymous, location-based social network built for students. Its mission is to provide a safe, unfiltered space where students can share real experiences—campus, hostels, faculty, and fun—without the fear of administration backlash or social judgment.

> *"Truth cannot be suppressed. Fear disappears. Only the truth remains."*

---

## 🌟 Key Features

### 1. 🕵️‍♂️ Complete Anonymity / Pseudo-Anonymity
- **No Login Required**: Users do not need to sign up with email or phone number.
- **Auto-Alias**: The system assigns a random alias (e.g., `Anon-12ab`) to every post and comment.
- **Trace-Free**: We prioritize user privacy.

### 2. 📍 Location-Based Feed (The "Nearby" Algorithm)
- **Auto-Detection**: The app uses the browser's Geolocation API to detect your **City** (e.g., "Bangalore").
- **Privacy-First**: We **ONLY** store the City name. Precise coordinates are discarded to protect privacy.
- **Localized Content**: The feed automatically prioritizes posts from your city, creating a hyper-local community feel.

### 3. 💬 Rich Interactions
- **Batching System**: Upvotes, Downvotes, and Comments update **instantly** on your screen (Optimistic UI) and are synced to the server in batches every 3 seconds for high performance.
- **Unfiltered Comments**: Speak your mind freely.
- **Media Support**: Upload photos and videos to back up your claims.

### 4. ⚖️ Community Moderation
- **Report System**: Users can flag posts as "True" or "False" and provide evidence.
- **Self-Cleaning**: The community decides what is trustworthy.

---

## 🛠️ Technical Architecture

### Frontend (User Interface)
- **Framework**: React.js (Vite)
- **Styling**: Vanilla CSS (Glassmorphism & Dark Mode)
- **State Management**: `@tanstack/react-query` (Caching & Data Fetching)
- **Icons**: `lucide-react`
- **Routing**: `react-router-dom`

### Backend (API Server)
- **Runtime**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (for images/videos)
- **Authentication**: None (Anonymous architecture)

---

## 🚀 How to Run (Developer Guide)

### Prerequisites
1.  **Node.js** installed.
2.  **Supabase** project set up with `posts`, `post_meta`, `comments`, `reports` tables.

### 1. Start the Backend
Navigate to the backend folder and start the server:
```bash
cd backend
npm install
npm start
```
*Runs on: `http://localhost:8000`*

### 2. Start the Frontend
Navigate to the frontend folder and start the Vite dev server:
```bash
cd college/collegescams
npm install
npm run dev
```
*Runs on: `http://localhost:5173`*

---

## 📂 Project Structure
- **/src/pages**:
    - `StartingPage.jsx`: Landing page.
    - `post.jsx`: Main Feed (with Location Logic).
    - `PostDetail.jsx`: Single post view.
    - `createpostmodal.jsx`: Upload popup.
    - `About.jsx`: Documentation page.
- **/src/hooks**:
    - `useGeoLocation.js`: Custom hook for City detection.
- **/backend**:
    - `server.js`: API endpoints (`/api/posts`, `/api/interact-batch`).
    - `supabase_schema.sql`: Database structure.

---

*This project is built for the purpose of free speech and student welfare.*
