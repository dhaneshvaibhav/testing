import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // IMPORT
import { Plus, Camera, Video, FileText, X } from 'lucide-react' // IMPORT ICONS
import StartingPage from "./pages/startingpage.jsx"
import Posts from "./pages/post.jsx"
import PostDetail from "./pages/PostDetail.jsx"
import Search from "./pages/Search.jsx"
import About from "./pages/About.jsx"
import Admin from "./pages/Admin.jsx"
import Navbar from "./components/Navbar.jsx"
import CreatePostModal from "./pages/createpostmodal.jsx"
import "./index.css"

const queryClient = new QueryClient() // INITIALIZE

function App() {
  const [showPicker, setShowPicker] = useState(false)
  const [postType, setPostType] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<StartingPage />} />
          <Route path="/posts" element={<Posts refreshKey={refreshKey} />} />
          <Route path="/search" element={<Search />} />
          <Route path="/about" element={<About />} />
          <Route path="/secret" element={<Admin />} />
          <Route path="/:college/:id" element={<PostDetail />} />
        </Routes>

        {/* ➕ FLOATING BUTTON */}
        <button
          style={styles.fab}
          onClick={() => setShowPicker(true)}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Plus size={32} />
        </button>

        {/* 📌 Bottom sheet - Choose upload format */}
        {showPicker && (
          <div style={styles.overlay} onClick={() => setShowPicker(false)}>
            <div style={styles.sheet} onClick={(e) => e.stopPropagation()}>
              <div style={styles.sheetHeader}>
                <h3 style={styles.sheetTitle}>Create New</h3>
                <button style={styles.closeBtn} onClick={() => setShowPicker(false)}>
                  <X size={24} />
                </button>
              </div>

              <div style={styles.pickerGrid}>
                <button style={styles.pickerBtn} onClick={() => { setPostType("photo"); setShowPicker(false); }}>
                  <span style={styles.icon}><Camera size={24} /></span> Photo
                </button>
                <button style={styles.pickerBtn} onClick={() => { setPostType("video"); setShowPicker(false); }}>
                  <span style={styles.icon}><Video size={24} /></span> Video
                </button>
                <button style={styles.pickerBtn} onClick={() => { setPostType("text"); setShowPicker(false); }}>
                  <span style={styles.icon}><FileText size={24} /></span> Text
                </button>
              </div>

              <p style={styles.hint}>Your identity is hidden. Speak freely.</p>
            </div>
          </div>
        )}

        {/* SHOW POST FORM WHEN TYPE SELECTED */}
        {postType && <CreatePostModal type={postType} onClose={() => setPostType(null)} onPostCreated={() => {
          setRefreshKey(k => k + 1);
          queryClient.invalidateQueries({ queryKey: ['posts'] }); // REFRESH CACHE
        }} />}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

const styles = {
  fab: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--primary), #00c2bb)',
    color: '#000',
    fontSize: '32px',
    fontWeight: 'bold',
    boxShadow: '0 0 20px rgba(0, 242, 234, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    transition: 'transform 0.2s ease',
    border: '2px solid rgba(255,255,255,0.2)',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 101,
    animation: 'fadeIn 0.2s ease-out',
  },
  sheet: {
    width: '90%',
    maxWidth: '400px',
    background: 'rgba(20, 20, 20, 0.9)',
    border: '1px solid var(--glass-border)',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
  },
  sheetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sheetTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--text-main)',
  },
  closeBtn: {
    color: 'var(--text-muted)',
    fontSize: '24px',
    padding: '4px',
  },
  pickerGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '12px',
    marginBottom: '20px',
  },
  pickerBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '16px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '16px',
    color: 'var(--text-main)',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background 0.2s',
    border: '1px solid transparent',
  },
  icon: {
    fontSize: '24px',
  },
  hint: {
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '13px',
  },
}

export default App
