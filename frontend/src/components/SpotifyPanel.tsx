import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Music,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  ListMusic,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Track {
  name: string;
  album: {
    images: { url: string }[];
    name: string;
  };
  artists: { name: string }[];
  duration_ms: number;
  id: string;
}

interface PlaybackState {
  is_playing: boolean;
  item: Track | null;
  progress_ms: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function SpotifyPanel() {
  const [isConnected, setIsConnected] = useState(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConnection();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isConnected) {
      fetchPlaybackState();
      interval = setInterval(fetchPlaybackState, 5000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const checkConnection = async () => {
    try {
      const res = await axios.get(`${API_URL}/spotify/player`, { withCredentials: true });
      if (res.data.connected === false) {
        setIsConnected(false);
      } else {
        setIsConnected(true);
        if (res.data.item) {
          setPlaybackState(res.data);
        }
      }
    } catch (error) {
      console.error('Spotify check failed', error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaybackState = async () => {
    try {
      const res = await axios.get(`${API_URL}/spotify/player`, { withCredentials: true });
      if (res.data && res.data.item) {
        setPlaybackState(res.data);
      } else {
        setPlaybackState((prev) => (prev ? { ...prev, is_playing: false } : null));
      }
    } catch (error) {
      console.error('Fetch playback failed', error);
    }
  };

  const handleLogin = async () => {
    const width = 600;
    const height = 800;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const authWindow = window.open(
      '',
      'SpotifyAuth',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    try {
      const res = await axios.get(`${API_URL}/spotify/login`, { withCredentials: true });
      if (authWindow) {
        authWindow.location.href = res.data.url;
      }

      const pollInterval = setInterval(async () => {
        try {
          const check = await axios.get(`${API_URL}/spotify/player`, { withCredentials: true });
          if (check.data.connected !== false) {
            clearInterval(pollInterval);
            setIsConnected(true);
            setPlaybackState(check.data.item ? check.data : null);
            toast.success('Spotify Connected Successfully!');
            fetchPlaybackState();
          }
        } catch {
          // Keep polling
        }
      }, 2000);

      setTimeout(() => clearInterval(pollInterval), 300000);
    } catch {
      if (authWindow) authWindow.close();
      toast.error('Failed to initialize Spotify login');
    }
  };

  const handlePlayPause = async () => {
    if (!playbackState) return;
    try {
      const endpoint = playbackState.is_playing ? 'pause' : 'play';
      await axios.put(`${API_URL}/spotify/${endpoint}`, {}, { withCredentials: true });
      setPlaybackState((prev) => (prev ? { ...prev, is_playing: !prev.is_playing } : null));
    } catch {
      toast.error('Premium required or no active device found');
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading)
    return (
      <div className="p-10 text-center animate-pulse text-slate-400 text-xs font-semibold">
        Connecting to Spotify Services...
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6 p-4 md:p-6 pb-24 font-sans text-slate-900"
    >
      {/* Hero Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold">
            <Music className="w-3.5 h-3.5 text-emerald-600" />
            <span>Focus Soundtrack</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Spotify Integration & Playback Control
          </h1>
          <p className="text-xs text-slate-500 font-medium max-w-xl">
            Control your Spotify focus playlists directly while tracking work sessions.
          </p>
        </div>
        {isConnected && (
          <button
            onClick={() => {}}
            className="text-xs font-bold text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-xl border border-red-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Disconnect Spotify
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!isConnected ? (
          <motion.div
            key="connect"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white border border-slate-200/80 rounded-2xl p-10 sm:p-16 shadow-2xs text-center flex flex-col items-center justify-center max-w-xl mx-auto space-y-5"
          >
            <div className="w-20 h-20 rounded-2xl bg-emerald-50 text-[#1DB954] border border-emerald-100 flex items-center justify-center">
              <Music className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Soundtrack Your Deep Work</h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
                Connect your Spotify Premium account to access playlists, control playback, and sync music with your focus timer.
              </p>
            </div>
            <button
              onClick={handleLogin}
              className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold px-8 py-3.5 rounded-xl text-xs shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Connect Spotify Premium</span>
              <ExternalLink className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-slate-400 font-medium">
              Requires Spotify Premium for live playback API controls.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Player Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-6 sm:p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Album Art */}
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-2xs shrink-0 flex items-center justify-center">
                  {playbackState?.item?.album.images[0]?.url ? (
                    <img
                      src={playbackState.item.album.images[0].url}
                      alt="Album Art"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Music className="w-12 h-12 text-slate-300" />
                  )}
                </div>

                {/* Controls & Track Info */}
                <div className="flex-1 min-w-0 space-y-5 text-center md:text-left w-full">
                  <div className="space-y-1">
                    {playbackState?.is_playing && (
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-[#6E36E4] border border-purple-100 mb-1">
                        Now Playing
                      </span>
                    )}
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 truncate">
                      {playbackState?.item?.name || 'No Active Track'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-semibold truncate">
                      {playbackState?.item?.artists.map((a) => a.name).join(', ') ||
                        'Open Spotify on your device to start playback'}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 max-w-xl mx-auto md:mx-0">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#6E36E4] transition-all duration-1000 ease-linear rounded-full"
                        style={{
                          width: playbackState?.item
                            ? `${(playbackState.progress_ms / playbackState.item.duration_ms) * 100}%`
                            : '0%',
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 font-bold">
                      <span>{formatTime(playbackState?.progress_ms || 0)}</span>
                      <span>{formatTime(playbackState?.item?.duration_ms || 0)}</span>
                    </div>
                  </div>

                  {/* Playback Buttons */}
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <button
                      onClick={() => axios.post(`${API_URL}/spotify/prev`, {}, { withCredentials: true })}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>

                    <button
                      onClick={handlePlayPause}
                      className="p-4 rounded-2xl bg-[#6E36E4] hover:bg-[#5B2AC6] text-white shadow-2xs transition-all cursor-pointer"
                    >
                      {playbackState?.is_playing ? (
                        <Pause className="w-6 h-6 fill-current" />
                      ) : (
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      )}
                    </button>

                    <button
                      onClick={() => axios.post(`${API_URL}/spotify/next`, {}, { withCredentials: true })}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <SkipForward className="w-5 h-5" />
                    </button>

                    <div className="hidden sm:flex items-center gap-3 ml-6 w-36">
                      <Volume2 className="w-4 h-4 text-slate-400" />
                      <Slider defaultValue={[50]} max={100} step={1} className="cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Playlists Notice */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs text-center space-y-2">
              <ListMusic className="w-6 h-6 text-[#6E36E4] mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">Custom Focus Playlists Sync</h4>
              <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
                Playlists can be selected directly inside your Spotify app. Custom playlist syncing for deep work rooms will be automatically supported in upcoming releases.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
