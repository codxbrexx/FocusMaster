const asyncHandler = require('express-async-handler');
const axios = require('axios');
const SpotifyToken = require('../models/SpotifyToken');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

// @desc    Get Spotify Login URL
// @route   GET /api/spotify/login
// @access  Private
const getLoginUrl = asyncHandler(async (req, res) => {
  const scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private';
  const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  res.json({ url });
});

// @desc    Handle Spotify Callback
// @route   POST /api/spotify/callback
// @access  Private
const callback = asyncHandler(async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
      }
    });

    const { access_token, refresh_token, expires_in } = response.data;

    // Save/Update token
    await SpotifyToken.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in,
        expiresAt: new Date(Date.now() + expires_in * 1000)
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: 'Spotify Connected' });
  } catch (error) {
    console.error(error.response?.data || error);
    res.status(400);
    throw new Error('Spotify auth failed');
  }
});

// Helper to get valid token
const getValidToken = async (userId) => {
    const tokenDoc = await SpotifyToken.findOne({ user: userId });
    if (!tokenDoc) return null;

    if (new Date() >= tokenDoc.expiresAt) {
        try {
            const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: tokenDoc.refreshToken,
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
                }
            });

            const { access_token, expires_in } = response.data;
            tokenDoc.accessToken = access_token;
            tokenDoc.expiresIn = expires_in;
            tokenDoc.expiresAt = new Date(Date.now() + expires_in * 1000);
            await tokenDoc.save();
            return access_token;
        } catch (error) {
            console.error('Error refreshing token', error.response?.data || error);
            return null;
        }
    }
    return tokenDoc.accessToken;
};

// @desc    Get Playback State
// @route   GET /api/spotify/player
// @access  Private
const getPlaybackState = asyncHandler(async (req, res) => {
    const token = await getValidToken(req.user._id);
    if (!token) {
        return res.status(401).json({ connected: false });
    }

    try {
        const response = await axios.get('https://api.spotify.com/v1/me/player', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.status === 204) {
             return res.json({ is_playing: false });
        }

        res.json({ ...response.data, connected: true });
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: 'Spotify API error' });
    }
});

// @desc    Play/Pause
// @route   POST /api/spotify/play
// @access  Private
const play = asyncHandler(async (req, res) => {
     const token = await getValidToken(req.user._id);
     if (!token) return res.status(401).json({ message: 'No token' });

     try {
         await axios.put('https://api.spotify.com/v1/me/player/play', {}, {
             headers: { 'Authorization': `Bearer ${token}` }
         });
         res.json({ success: true });
     } catch (error) {
        //  console.error(error.response?.data);
         res.status(error.response?.status || 500).json({ message: 'Action failed' });
     }
});

const pause = asyncHandler(async (req, res) => {
     const token = await getValidToken(req.user._id);
     if (!token) return res.status(401).json({ message: 'No token' });

     try {
         await axios.put('https://api.spotify.com/v1/me/player/pause', {}, {
             headers: { 'Authorization': `Bearer ${token}` }
         });
         res.json({ success: true });
     } catch (error) {
         res.status(error.response?.status || 500).json({ message: 'Action failed' });
     }
});

module.exports = {
  getLoginUrl,
  callback,
  getPlaybackState,
  play,
  pause
};
