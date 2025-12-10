# LinkedIn Login Testing Guide

## Quick Test Steps

### 1. Create `.env` file

Create a `.env` file in the `linkedin-login` folder with your credentials:

```env
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
LINKEDIN_CALLBACK_URL=your_callback_url_here
SESSION_SECRET=any-random-string-here
PORT=3001
```

### 2. Start the Server

```bash
npm start
```

You should see:
```
🚀 LinkedIn Login Server running on http://localhost:3001
📝 Make sure to set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET in .env file

📋 Configuration:
   Client ID: ✅ Set
   Client Secret: ✅ Set
   Callback URL: your_callback_url_here
   Scopes: openid, profile, r_events, w_member_social, email, rw_events

🔗 Test URLs:
   Home: http://localhost:3001
   Login: http://localhost:3001/auth/linkedin
   Config Check: http://localhost:3001/api/config
```

### 3. Verify Configuration

Open in browser: `http://localhost:3001/api/config`

You should see a JSON response showing:
- ✅ Client ID: Set
- ✅ Client Secret: Set
- Callback URL
- Scopes list
- Port number

### 4. Test Login Flow

1. Open: `http://localhost:3001`
2. Click "Login with LinkedIn"
3. You'll be redirected to LinkedIn
4. Authorize the app with the requested permissions
5. You'll be redirected back to your callback URL
6. You should see your profile information

### 5. Check Console Logs

After successful login, check the server console for:
```
LinkedIn login successful: {
  id: '...',
  name: '...',
  email: '...',
  ...
}
```

## Troubleshooting

### Error: "Invalid redirect_uri"
- Make sure the callback URL in `.env` matches exactly with LinkedIn App settings
- Check for trailing slashes or http vs https

### Error: "Invalid client_id or client_secret"
- Double-check your credentials in `.env` file
- Make sure there are no extra spaces

### Error: "Insufficient permissions"
- Some scopes require app verification
- For testing, make sure your LinkedIn app has requested these products:
  - Sign In with LinkedIn using OpenID Connect
  - Marketing Developer Platform (for r_events, w_member_social, rw_events)

### No redirect after login
- Check the callback URL is correct
- Make sure the server is running
- Check browser console for errors

## Expected Scopes

The app requests these scopes:
- `openid` - OpenID Connect
- `profile` - Basic profile (name, photo)
- `r_events` - Read organization events
- `w_member_social` - Create/modify posts, comments, reactions
- `email` - Email address
- `rw_events` - Manage organization events

## Test API Endpoints

- `GET /` - Home page
- `GET /auth/linkedin` - Start login
- `GET /auth/linkedin/callback` - Callback (automatic)
- `GET /api/user` - Get logged-in user (JSON)
- `GET /api/config` - Check configuration
- `GET /logout` - Logout

