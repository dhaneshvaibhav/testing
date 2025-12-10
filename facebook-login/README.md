# Facebook Login Server

Standalone Facebook login implementation using Express and Passport.js.

## Setup

### 1. Install Dependencies

```bash
cd facebook-login
npm install
```

### 2. Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Choose "Consumer" app type
4. Add "Facebook Login" product
5. Go to Settings → Basic:
   - Copy **App ID** and **App Secret**
6. Go to Facebook Login → Settings:
   - Add Valid OAuth Redirect URIs: `http://localhost:3000/auth/facebook/callback`
   - Save changes

### 3. Configure Environment

Create a `.env` file in the `facebook-login` folder:

```env
FACEBOOK_APP_ID=your_app_id_here
FACEBOOK_APP_SECRET=your_app_secret_here
FACEBOOK_CALLBACK_URL=http://localhost:3000/auth/facebook/callback
SESSION_SECRET=any-random-string-here
PORT=3000
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

1. Open browser: `http://localhost:3000`
2. Click "Login with Facebook"
3. Authorize the app
4. You'll be redirected back with your profile information

## API Endpoints

- `GET /` - Home page with login button
- `GET /auth/facebook` - Initiate Facebook login
- `GET /auth/facebook/callback` - Facebook callback (handled automatically)
- `GET /logout` - Logout user
- `GET /api/user` - Get current logged-in user (JSON)

## User Data Structure

After successful login, user object contains:

```javascript
{
  id: "facebook_user_id",
  name: "User Name",
  email: "user@example.com",
  photo: "profile_photo_url",
  provider: "facebook",
  accessToken: "facebook_access_token"
}
```

## Troubleshooting

- **"Invalid OAuth Redirect URI"**: Make sure the callback URL in `.env` matches exactly with Facebook App settings
- **"App Not Setup"**: Make sure Facebook Login product is added to your app
- **"App in Development Mode"**: Add test users in Facebook App settings, or make the app public

