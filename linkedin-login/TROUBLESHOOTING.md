# Troubleshooting: Client Authentication Failed

## Common Causes

### 1. Incorrect Credentials in .env File

**Check your `.env` file:**
```env
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
LINKEDIN_CALLBACK_URL=http://localhost:3000/auth/linkedin/callback
```

**Common mistakes:**
- ❌ Extra spaces: `LINKEDIN_CLIENT_ID = abc123` (has spaces around `=`)
- ✅ Correct: `LINKEDIN_CLIENT_ID=abc123`
- ❌ Quotes: `LINKEDIN_CLIENT_ID="abc123"` (don't use quotes)
- ✅ Correct: `LINKEDIN_CLIENT_ID=abc123`
- ❌ Trailing spaces: `LINKEDIN_CLIENT_ID=abc123 ` (space at end)
- ✅ Correct: `LINKEDIN_CLIENT_ID=abc123`

### 2. Verify Credentials Match LinkedIn App

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Select your app
3. Go to "Auth" tab
4. Compare:
   - **Client ID** (should match `LINKEDIN_CLIENT_ID` in .env)
   - **Client Secret** (click "Show" to reveal, should match `LINKEDIN_CLIENT_SECRET` in .env)

### 3. Check .env File Location

Make sure `.env` file is in the `linkedin-login` folder (same folder as `server.js`)

### 4. Restart Server After Changing .env

After modifying `.env` file, you MUST restart the server:
```bash
# Stop server (Ctrl+C)
# Then restart
npm start
```

### 5. Verify Configuration

Visit: `http://localhost:3000/api/config`

You should see:
```json
{
  "clientId": "✅ Set (12345678...abcd)",
  "clientSecret": "✅ Set (abcdef12...3456)",
  "callbackURL": "http://localhost:3000/auth/linkedin/callback",
  ...
}
```

If you see "❌ Missing", your .env file is not being loaded.

## Step-by-Step Fix

1. **Stop the server** (Ctrl+C)

2. **Check .env file exists** in `linkedin-login` folder

3. **Verify .env format:**
   ```env
   LINKEDIN_CLIENT_ID=your_actual_client_id
   LINKEDIN_CLIENT_SECRET=your_actual_client_secret
   LINKEDIN_CALLBACK_URL=http://localhost:3000/auth/linkedin/callback
   SESSION_SECRET=any-random-string
   PORT=3000
   ```
   - No spaces around `=`
   - No quotes
   - No trailing spaces

4. **Copy credentials directly from LinkedIn:**
   - Go to LinkedIn App → Auth tab
   - Copy Client ID exactly
   - Click "Show" on Client Secret and copy exactly
   - Paste into .env (no extra characters)

5. **Restart server:**
   ```bash
   npm start
   ```

6. **Check startup logs:**
   - Should show: `Client ID: ✅ 12345678...abcd`
   - Should show: `Client Secret: ✅ abcdef12...3456`

7. **Test config endpoint:**
   - Visit: `http://localhost:3000/api/config`
   - Verify both show "✅ Set"

8. **Try login again:**
   - Visit: `http://localhost:3000`
   - Click "Login with LinkedIn"

## Still Not Working?

1. **Double-check LinkedIn App settings:**
   - App is not deleted/suspended
   - Client ID and Secret are correct
   - App has required products enabled

2. **Check server console:**
   - Look for any error messages
   - Check if credentials are being loaded

3. **Try creating new credentials:**
   - In LinkedIn App → Auth tab
   - Generate new Client Secret
   - Update .env with new secret
   - Restart server

4. **Verify callback URL:**
   - Must match exactly in LinkedIn App settings
   - Check for http vs https
   - Check for trailing slashes

