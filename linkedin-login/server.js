// server.js — Snapchat Login (Corrected)
import express from "express";
import axios from "axios";
import qs from "qs";

const app = express();
const port = 3000;

// USE PUBLIC CLIENT ID HERE
const SNAPCHAT_CLIENT_ID = "e9957a04-609f-4940-861b-38ed61e1c111";

// Confidential secret from your dashboard
const SNAPCHAT_CLIENT_SECRET = "4ba5a47dfb20daa3db3a";

const SNAPCHAT_REDIRECT_URI =
  "https://auth.kautilya.app/oauth/callback/snapchat";

// Build login URL
function buildAuthUrl() {
  const scope = "openid%20display_name%20bitmoji.read";
  return (
    `https://accounts.snapchat.com/accounts/oauth2/auth` +
    `client_id=${SNAPCHAT_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(SNAPCHAT_REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=${scope}`
  );
}

app.get("/", (req, res) => {
  res.send(`<a href="${buildAuthUrl()}">Login with Snapchat</a>`);
});

// Callback
app.get("/auth/snapchat/callback", async (req, res) => {
  const { code, error } = req.query;

  if (error) return res.send("Snapchat error: " + error);
  if (!code) return res.send("No code received");

  // Exchange code for token
  try {
    const tokenResponse = await axios.post(
      "https://accounts.snapchat.com/login/oauth2/access_token",
      qs.stringify({
        grant_type: "authorization_code",
        client_id: SNAPCHAT_CLIENT_ID,
        client_secret: SNAPCHAT_CLIENT_SECRET,
        redirect_uri: SNAPCHAT_REDIRECT_URI,
        code,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenResponse.data.access_token;

    const userInfo = await axios.get("https://kit.snapchat.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    res.json({
      message: "Success",
      token: accessToken,
      user: userInfo.data,
    });
  } catch (err) {
    return res.send("Error: " + JSON.stringify(err.response?.data));
  }
});

app.listen(port, () => console.log("Server running on", port));
