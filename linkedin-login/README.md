# LinkedIn Login Server

Standalone LinkedIn login implementation using Express and Passport.js.

## Setup

### 1. Install Dependencies

```bash
cd linkedin-login
npm install
```

### 2. Create LinkedIn App

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Click "Create app"
3. Fill in app details:
   - App name: Your app name
   - LinkedIn Page: Select or create a page
   - Privacy policy URL: Your privacy policy URL
   - App logo: Upload a logo
4. After creation, go to "Auth" tab:
   - Copy **Client ID** and **Client Secret**
   - Add redirect URL: `http://localhost:3001/auth/linkedin/callback`
   - Under "Products", request access to:
     - Sign In with LinkedIn using OpenID Connect
     - Email address (r_emailaddress)
     - Basic profile (r_liteprofile)
5. Submit for verification (if needed)

### 3. Configure Environment

Create a `.env` file in the `linkedin-login` folder:

```env
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
LINKEDIN_CALLBACK_URL=http://localhost:3001/auth/linkedin/callback
SESSION_SECRET=any-random-string-here
PORT=3001
```

### 4. Run the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

### 5. Test

1. Open browser: `http://localhost:3001`
2. Click "Login with LinkedIn"
3. Authorize the app
4. You'll be redirected back with your profile information

## API Endpoints

- `GET /` - Home page with login button
- `GET /auth/linkedin` - Initiate LinkedIn login
- `GET /auth/linkedin/callback` - LinkedIn callback (handled automatically)
- `GET /logout` - Logout user
- `GET /api/user` - Get current logged-in user (JSON)

## User Data Structure

After successful login, user object contains:

```javascript
{
  id: "linkedin_user_id",
  name: "User Name",
  email: "user@example.com",
  photo: "profile_photo_url",
  headline: "Professional headline",
  provider: "linkedin",
  accessToken: "linkedin_access_token",
  refreshToken: "linkedin_refresh_token"
}
```

## LinkedIn Scopes

The app requests these scopes:
- `r_emailaddress` - Access to email address
- `r_liteprofile` - Access to basic profile information

## Troubleshooting

- **"Invalid redirect_uri"**: Make sure the callback URL in `.env` matches exactly with LinkedIn App settings
- **"App not verified"**: Some scopes require app verification. For development, use basic scopes
- **"Insufficient permissions"**: Make sure you've requested the correct products in LinkedIn App settings
- **"Client ID/Secret invalid"**: Double-check your credentials in the LinkedIn App Auth tab

## Notes

- LinkedIn uses OAuth 2.0
- Default port is 3001 (to avoid conflict with Facebook login on 3000)
- Make sure your LinkedIn app is in "Development" mode for testing
- For production, you'll need to verify your app with LinkedIn

