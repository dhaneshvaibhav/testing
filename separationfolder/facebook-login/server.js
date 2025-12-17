import express from "express";
import passport from "passport";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import session from "express-session";
import axios from "axios";

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: "your-secret-key-change-this",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true if using https
}));

// Passport setup
passport.use(new LinkedInStrategy({
  clientID: "86luki21gbtjbk",
  clientSecret: "WPL_AP1.g7XptOv2EfAWnEMs.Olhs6w==",
  callbackURL: "http://localhost:3000/auth/linked/callback",
  scope: ["r_community_management"]
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Get user profile with access token
    const profileRes = await axios.get("https://api.linkedin.com/v2/userinfo", {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0"
      }
    });
    
    const userProfile = profileRes.data;
    return done(null, { 
      id: userProfile.sub, 
      accessToken,
      profile: userProfile 
    });
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => done(null, { id }));

app.use(passport.initialize());
app.use(passport.session());

/* =====================================================
   HOME PAGE
   ===================================================== */
app.get("/", (req, res) => {
  const loginURL = `/auth/linkedin`;
  
  res.send(`
    <html>
      <body style="font-family:Arial; padding:100px; text-align:center; background:#f0f2f5">
        <div style="max-width:400px; margin:auto; background:white; padding:40px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1)">
          <h2>🔗 LinkedIn Community Management</h2>
          
          ${req.user ? `
            <div style="margin-top:30px; padding:20px; background:#e8f5e8; border-radius:8px; border-left:4px solid #28a745">
              <h3>✅ LOGGED IN!</h3>
              <p>User ID: ${req.user.id}</p>
              <a href="/debug" style="color:#0073b1">Debug</a> | 
              <a href="/logout" style="color:#dc3545">Logout</a>
            </div>
          ` : `
            <a href="${loginURL}" style="display:inline-block; background:#0073b1; color:white; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold">
              Login with LinkedIn
            </a>
          `}
        </div>
      </body>
    </html>
  `);
});

/* =====================================================
   LINKEDIN AUTH
   ===================================================== */
app.get('/auth/linkedin',
  passport.authenticate('linkedin', { 
    scope: ['r_community_management'] 
  })
);

app.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', { 
    failureRedirect: '/' 
  }),
  (req, res) => {
    res.redirect('/');
  }
);

/* =====================================================
   LOGOUT
   ===================================================== */
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

/* =====================================================
   DEBUG
   ===================================================== */
app.get("/debug", (req, res) => {
  res.json({
    isAuthenticated: req.isAuthenticated(),
    user: req.user || null,
    sessionID: req.sessionID,
    status: "passport-ready"
  });
});

app.listen(3000, () => {
  console.log("🚀 http://localhost:3000");
});
