import express from 'express';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3000/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'email', 'photos']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract user information from Facebook profile
        const user = {
          id: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value || null,
          photo: profile.photos?.[0]?.value || null,
          provider: 'facebook',
          accessToken: accessToken
        };

        console.log('Facebook login successful:', user);
        return done(null, user);
      } catch (error) {
        console.error('Facebook strategy error:', error);
        return done(error, null);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Routes
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Facebook Login</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            text-align: center;
          }
          h1 { color: #333; margin-bottom: 20px; }
          .btn {
            background: #1877f2;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin-top: 20px;
          }
          .btn:hover { background: #166fe5; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Facebook Login Demo</h1>
          <p>Click the button below to login with Facebook</p>
          <a href="/auth/facebook" class="btn">Login with Facebook</a>
        </div>
      </body>
    </html>
  `);
});

// Facebook authentication routes
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login-failed' }),
  (req, res) => {
    // Successful authentication
    res.send(`
      <html>
        <head>
          <title>Login Successful</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 10px 40px rgba(0,0,0,0.2);
              max-width: 500px;
            }
            h1 { color: #4caf50; margin-bottom: 20px; }
            .user-info {
              background: #f5f5f5;
              padding: 20px;
              border-radius: 5px;
              margin: 20px 0;
              text-align: left;
            }
            .user-info p { margin: 10px 0; }
            .user-info strong { color: #333; }
            img { width: 100px; height: 100px; border-radius: 50%; margin: 10px 0; }
            .btn {
              background: #1877f2;
              color: white;
              padding: 10px 20px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              text-decoration: none;
              display: inline-block;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✅ Login Successful!</h1>
            <div class="user-info">
              ${req.user.photo ? `<img src="${req.user.photo}" alt="Profile" />` : ''}
              <p><strong>Name:</strong> ${req.user.name}</p>
              <p><strong>Email:</strong> ${req.user.email || 'Not provided'}</p>
              <p><strong>Facebook ID:</strong> ${req.user.id}</p>
              <p><strong>Provider:</strong> ${req.user.provider}</p>
            </div>
            <a href="/logout" class="btn">Logout</a>
            <a href="/" class="btn" style="background: #666; margin-left: 10px;">Home</a>
          </div>
        </body>
      </html>
    `);
  }
);

// Logout route
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.send('Error logging out');
    }
    res.redirect('/');
  });
});

// Login failed route
app.get('/login-failed', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Login Failed</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            text-align: center;
          }
          h1 { color: #f5576c; }
          .btn {
            background: #1877f2;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>❌ Login Failed</h1>
          <p>Please try again</p>
          <a href="/" class="btn">Go Back</a>
        </div>
      </body>
    </html>
  `);
});

// API route to get current user (if logged in)
app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Facebook Login Server running on http://localhost:${PORT}`);
  console.log(`📝 Make sure to set FACEBOOK_APP_ID and FACEBOOK_APP_SECRET in .env file`);
});

