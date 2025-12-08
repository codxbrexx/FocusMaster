import { useState } from 'react';
import {
  Music,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Heart,
  Mic2,
  Radio,
  ListMusic,
  Settings2,
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

const mockPlaylists = [
  {
    id: '1',
    name: 'Lo-Fi Coding',
    tracks: 47,
    image: '☕',
    color: 'from-primary/20 to-accent/20',
    border: 'border-primary/20',
  },
  {
    id: '2',
    name: 'Deep Focus',
    tracks: 156,
    image: '🌌',
    color: 'from-chart-2/20 to-primary/20',
    border: 'border-chart-2/20',
  },
  {
    id: '3',
    name: 'Ambient Study',
    tracks: 93,
    image: '🌧️',
    color: 'from-accent/20 to-primary/20',
    border: 'border-accent/20',
  },
  {
    id: '4',
    name: 'Piano & Strings',
    tracks: 64,
    image: '🎹',
    color: 'from-chart-3/20 to-chart-3/10',
    border: 'border-chart-3/20',
  },
  {
    id: '5',
    name: 'Electronica',
    tracks: 82,
    image: '⚡',
    color: 'from-chart-2/20 to-chart-2/10',
    border: 'border-chart-2/20',
  },
  {
    id: '6',
    name: 'White Noise',
    tracks: 12,
    image: '🌊',
    color: 'from-muted/20 to-muted/10',
    border: 'border-muted/20',
  },
];

const mockCurrentTrack = {
  title: 'Midnight City',
  artist: 'M83',
  album: "Hurry Up, We're Dreaming",
  duration: 245,
  cover: '🌃',
};

export function SpotifyPanel() {
  const [isConnected, setIsConnected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [currentTime] = useState(45);
  const [selectedPlaylist, setSelectedPlaylist] = useState('1');
  const [selectedMood, setSelectedMood] = useState('focus');
  const [isLiked, setIsLiked] = useState(false);

  const handleConnect = () => {
    setIsConnected(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = (currentTime / mockCurrentTrack.duration) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Music & Focus</h2>
          <p className="text-muted-foreground">Curated soundscapes for productivity.</p>
        </div>
        {!isConnected && (
          <Button
            onClick={handleConnect}
            className="gap-2 bg-[#1DB954] hover:bg-[#1ed760] text-primary-foreground rounded-full"
          >
            <Music className="w-5 h-5" />
            Connect Spotify
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!isConnected ? (
          <motion.div
            key="connect"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col"
          >
            <Card className="border-2 border-dashed border-muted/50 backdrop-blur-xl bg-card/50 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
              <CardContent className="pt-20 pb-20 text-center relative z-10 flex flex-col items-center justify-center max-w-lg mx-auto">
                <div className="w-24 h-24 rounded-full bg-[#1DB954]/10 flex items-center justify-center mb-6 animate-pulse">
                  <Music className="w-12 h-12 text-[#1DB954]" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Soundtrack Your Workflow</h3>
                <p className="text-muted-foreground mb-8 text-lg">
                  Link your Spotify Premium account to control playback, select playlists, and sync
                  music with your Pomodoro timer automatically.
                </p>
                <Button
                  onClick={handleConnect}
                  size="lg"
                  className="gap-2 rounded-full px-8 bg-[#1DB954] hover:bg-[#1ed760] text-primary-foreground shadow-lg"
                >
                  Connect Spotify
                </Button>
                <p className="text-xs text-muted-foreground mt-6 max-w-xs mx-auto">
                  This is a demo integration. In a production environment, this would redirect to
                  Spotify's OAuth portal.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            <div className="lg:col-span-12">
              <Card className="overflow-hidden border-2 shadow-xl backdrop-blur-xl bg-card/50 relative">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row h-full md:h-[320px]">
                    <div className="w-full md:w-[320px] bg-accent/30 p-8 flex flex-col items-center justify-center relative group">
                      <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl shadow-2xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center text-7xl relative overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                        <span className="z-10">{mockCurrentTrack.cover}</span>
                        <div className="absolute inset-0 bg-card/10 mix-blend-overlay" />
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="rounded-full shadow-lg bg-card/80 backdrop-blur-sm"
                          onClick={() => setIsLiked(!isLiked)}
                        >
                          <Heart
                            className={`w-5 h-5 ${isLiked ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`}
                          />
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                      <div className="space-y-1 text-center md:text-left">
                        <Badge
                          variant="outline"
                          className="mb-2 border-primary/20 text-primary bg-primary/5"
                        >
                          Now Playing
                        </Badge>
                        <h2 className="text-3xl font-bold tracking-tight truncate">
                          {mockCurrentTrack.title}
                        </h2>
                        <p className="text-lg text-muted-foreground">
                          {mockCurrentTrack.artist} • {mockCurrentTrack.album}
                        </p>
                      </div>

                      <div className="space-y-6 mt-6 md:mt-0">
                        <div className="space-y-2">
                          <div className="h-1.5 bg-accent rounded-full overflow-hidden cursor-pointer group">
                            <motion.div
                              className="h-full bg-primary relative"
                              initial={{ width: 0 }}
                              animate={{ width: `${progressPercent}%` }}
                              transition={{ ease: 'linear', duration: 0.5 }}
                            >
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                          </div>
                          <div className="flex justify-between text-xs font-medium text-muted-foreground">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(mockCurrentTrack.duration)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-center md:justify-start gap-6">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                          >
                            <Mic2 className="w-5 h-5" />
                          </Button>

                          <div className="flex items-center gap-4">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-10 w-10 rounded-full border-none bg-accent/50 hover:bg-accent"
                            >
                              <SkipBack className="w-5 h-5" />
                            </Button>
                            <Button
                              className="h-14 w-14 rounded-full shadow-lg glow-primary hover:scale-105 transition-transform"
                              onClick={() => setIsPlaying(!isPlaying)}
                            >
                              {isPlaying ? (
                                <Pause className="w-6 h-6 fill-current" />
                              ) : (
                                <Play className="w-6 h-6 fill-current ml-1" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-10 w-10 rounded-full border-none bg-accent/50 hover:bg-accent"
                            >
                              <SkipForward className="w-5 h-5" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-3 w-full max-w-[140px] ml-auto md:ml-4">
                            <Volume2 className="w-4 h-4 text-muted-foreground" />
                            <Slider
                              value={volume}
                              max={100}
                              step={1}
                              className="cursor-pointer"
                              onValueChange={(val) => setVolume(val)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <ListMusic className="w-5 h-5 text-primary" />
                  Focus Playlists
                </h3>

                <Select value={selectedMood} onValueChange={setSelectedMood}>
                  <SelectTrigger className="w-[160px] h-9">
                    <SelectValue placeholder="Mood" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="focus">🎯 Deep Focus</SelectItem>
                    <SelectItem value="relax">🍃 Relax/Chill</SelectItem>
                    <SelectItem value="energetic">⚡ High Energy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockPlaylists.map((playlist) => (
                  <motion.div
                    key={playlist.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all border-l-4 ${selectedPlaylist === playlist.id ? `${playlist.border} bg-accent/10` : 'border-transparent hover:bg-accent/5'}`}
                      onClick={() => setSelectedPlaylist(playlist.id)}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div
                          className={`w-14 h-14 rounded-md bg-gradient-to-br ${playlist.color} flex items-center justify-center text-2xl shadow-sm`}
                        >
                          {playlist.image}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{playlist.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {playlist.tracks} tracks • 2 hrs
                          </p>
                        </div>
                        {selectedPlaylist === playlist.id && (
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" />
                Preferences
              </h3>
              <Card className="h-full backdrop-blur-xl bg-card/50 border-2 shadow-sm">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="font-medium">Auto-Sync Timer</p>
                      <p className="text-xs text-muted-foreground">Start/Pause music with timer</p>
                    </div>
                    <Button
                      size="sm"
                      variant={isPlaying ? 'default' : 'outline'}
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="h-7 text-xs"
                    >
                      On
                    </Button>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="font-medium">Smart Shuffle</p>
                      <p className="text-xs text-muted-foreground">
                        Mix tracks based on focus level
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Off
                    </Button>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="font-medium">Crossfade</p>
                      <p className="text-xs text-muted-foreground">Smooth transitions (5s)</p>
                    </div>
                    <Button size="sm" variant="default" className="h-7 text-xs">
                      On
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-card/50 border-2 border-primary/20">
                <CardContent className="p-6 text-center">
                  <Radio className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h4 className="font-medium mb-1">Discover Weekly</h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Fresh beats for your Monday focus sessions.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Listen Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
