import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Music,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  LogOut,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

  // Check connection status on mount
  useEffect(() => {
    checkConnection();
  }, []);

  // Poll for playback state if connected
  useEffect(() => {
    let interval: any;
    if (isConnected) {
      fetchPlaybackState();
      interval = setInterval(fetchPlaybackState, 5000); // Poll every 5s
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
      console.error("Spotify check failed", error);
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
        setPlaybackState(prev => prev ? { ...prev, is_playing: false } : null);
      }
    } catch (error) {
      console.error("Fetch playback failed", error);
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
            toast.success("Spotify Connected Successfully!");
            fetchPlaybackState();
          }
        } catch {
          // Keep polling
        }
      }, 2000);

      setTimeout(() => clearInterval(pollInterval), 300000);

    } catch {
      if (authWindow) authWindow.close();
      toast.error("Failed to initialize Spotify login");
    }
  };

  const handlePlayPause = async () => {
    if (!playbackState) return;
    try {
      const endpoint = playbackState.is_playing ? 'pause' : 'play';
      await axios.put(`${API_URL}/spotify/${endpoint}`, {}, { withCredentials: true });
      setPlaybackState(prev => prev ? { ...prev, is_playing: !prev.is_playing } : null);
    } catch {
      toast.error("Premium required or no active device found");
    }
  };

  const nextTrack = async () => {
    try {
      await axios.post(`${API_URL}/spotify/next`, {}, { withCredentials: true });
      setTimeout(fetchPlaybackState, 500);
    } catch { toast.error("Failed to skip"); }
  };

  const previousTrack = async () => {
    try {
      await axios.post(`${API_URL}/spotify/prev`, {}, { withCredentials: true });
      setTimeout(fetchPlaybackState, 500);
    } catch { toast.error("Failed to skip"); }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] bg-card/40 backdrop-blur-xl rounded-3xl border border-border shadow-soft">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">Syncing with Spotify...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <Card className="h-full min-h-[400px] flex flex-col overflow-hidden border-border bg-card/40 backdrop-blur-xl shadow-soft group relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <CardHeader className="relative z-10">
          <div className="flex items-center gap-2 text-2xl font-bold font-heading text-foreground">
            <Music className="w-6 h-6 text-primary" />
            Spotify
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 text-center gap-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-2 animate-float">
            <Music className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-2 max-w-xs">
            <h3 className="text-xl font-bold text-foreground">Soundtrack Your Flow</h3>
            <p className="text-muted-foreground">Connect your Spotify account to control playback directly from your dashboard.</p>
          </div>

          <Button
            onClick={handleLogin}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-lg w-full max-w-[200px] h-12 text-lg font-medium"
          >
            Connect Spotify
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden border-border bg-card/40 backdrop-blur-xl shadow-soft relative group">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <div className="text-xl font-bold flex items-center gap-2 font-heading text-foreground">
          <Music className="w-5 h-5 text-primary" />
          Spotify
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {/* Implement disconnect logic */ }}
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Disconnect"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-6 gap-6 relative z-10">
        {/* Now Playing Info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group/cover">
              <img
                src={playbackState?.item?.album?.images[0]?.url || "https://placehold.co/400x400/1e293b/475569?text=No+Music"}
                alt="Album Art"
                className="w-24 h-24 rounded-2xl shadow-lg object-cover ring-1 ring-border group-hover/cover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -bottom-2 -right-2 bg-card border border-border p-1.5 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>

            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                  Now Playing
                </span>
              </div>
              <h3 className="font-bold text-lg text-foreground truncate leading-tight hover:text-primary transition-colors cursor-default">
                {playbackState?.item?.name || "Not Playing"}
              </h3>
              <p className="text-muted-foreground truncate text-sm font-medium">
                {playbackState?.item?.artists?.[0]?.name || "Select a track on Spotify"}
              </p>
            </div>
          </div>

          {/* Progress Bar (Visual Only for now) */}
          <div className="space-y-1.5">
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full animate-pulse transition-all duration-1000"
                style={{ width: playbackState?.item ? `${(playbackState.progress_ms / playbackState.item.duration_ms) * 100}%` : '0%' }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              <span>{formatTime(playbackState?.progress_ms || 0)}</span>
              <span>{formatTime(playbackState?.item?.duration_ms || 0)}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full w-10 h-10">
            <div className="w-4 h-4" /> {/* Shuffle placeholder */}
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={previousTrack}
              className="text-foreground hover:scale-110 transition-transform rounded-full w-10 h-10 hover:bg-muted"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </Button>

            <Button
              size="icon"
              className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow hover:scale-105 transition-all"
              onClick={handlePlayPause}
            >
              {playbackState?.is_playing ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-1" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextTrack}
              className="text-foreground hover:scale-110 transition-transform rounded-full w-10 h-10 hover:bg-muted"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </Button>
          </div>

          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full w-10 h-10">
            <div className="w-4 h-4" /> {/* Repeat placeholder */}
          </Button>
        </div>

        {/* Placeholder for Playlists */}
        <div className="pt-4 border-t border-border mt-auto h-[120px] overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quick Access</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary">View All</Button>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors cursor-pointer border border-transparent hover:border-border group/item">
              <div className="w-8 h-8 rounded-md bg-card shadow-sm flex items-center justify-center text-muted-foreground group-hover/item:text-primary transition-colors">
                <Music className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">Your Top Mix</p>
                <p className="text-[10px] text-muted-foreground">Spotify</p>
              </div>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
