import { useState } from "react";

export default function CreatePostModal({ type, onClose, onPostCreated }) {
  const [file, setFile] = useState(null);
  const [college, setCollege] = useState("");
  const [caption, setCaption] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [alias, setAlias] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("type", type);
    formData.append("college", college);
    formData.append("caption", caption);
    formData.append("tags", tags);
    formData.append("alias", alias);

    if (type === "text") formData.append("body", body);
    else if (file) formData.append("file", file);

    const res = await fetch("http://localhost:8000/api/posts", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    console.log("Uploaded Response:", data);
    // alert("Posted Successfully!");
    onPostCreated && onPostCreated();
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <form style={styles.modal} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: "10px" }}>Create {type} post</h2>

        <input required placeholder="College Name" value={college}
          onChange={(e) => setCollege(e.target.value)} style={styles.input} />

        <input placeholder="Caption (optional)" value={caption}
          onChange={(e) => setCaption(e.target.value)} style={styles.input} />

        <input placeholder="Tags (comma separated)" value={tags}
          onChange={(e) => setTags(e.target.value)} style={styles.input} />

        <input placeholder="Alias (optional)" value={alias}
          onChange={(e) => setAlias(e.target.value)} style={styles.input} />

        {type !== "text" && (
          <input type="file" accept={type === "photo" ? "image/*" : "video/*"} required
            onChange={(e) => setFile(e.target.files[0])} style={styles.input} />
        )}

        {type === "text" && (
          <textarea required placeholder="Write your post..."
            value={body} onChange={(e) => setBody(e.target.value)}
            style={{ ...styles.input, height: "120px" }} />
        )}

        <button type="submit" style={styles.submit}>Post</button>
      </form>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center"
  },
  modal: {
    background: "#fff", padding: "22px", width: "92%", maxWidth: "440px",
    borderRadius: "14px", display: "flex", flexDirection: "column", gap: "10px"
  },
  input: { padding: "10px", border: "1px solid #ccc", borderRadius: "8px" },
  submit: {
    padding: "12px", borderRadius: "10px", background: "#628141", color: "#fff",
    fontWeight: 700, fontSize: "16px", border: "none", cursor: "pointer"
  }
}
