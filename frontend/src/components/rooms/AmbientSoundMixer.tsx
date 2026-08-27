import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Play, Pause, Sparkles } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface AmbientSoundMixerProps {
  preset?: string;
}

const PRESETS = [
  { id: 'none', label: 'Off', icon: '🔇' },
  { id: 'rain', label: 'Rain', icon: '🌧️' },
  { id: 'lofi', label: 'Lo-Fi Chill', icon: '🎧' },
  { id: 'forest', label: 'Forest Birds', icon: '🌲' },
  { id: 'ocean', label: 'Ocean Waves', icon: '🌊' },
  { id: 'cafe', label: 'Cafe Ambient', icon: '☕' },
];

export function AmbientSoundMixer({ preset = 'rain' }: AmbientSoundMixerProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>(preset !== 'none' ? preset : 'rain');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(50);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Web Audio Synth generator refs for noise loops without external audio asset dependencies
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | OscillatorNode | null>(null);

  useEffect(() => {
    if (preset && preset !== 'none') {
      setSelectedPreset(preset);
    }
  }, [preset]);

  // Audio Context management
  const stopAudio = () => {
    if (noiseSourceRef.current) {
      try {
        noiseSourceRef.current.stop();
        noiseSourceRef.current.disconnect();
      } catch (e) {
        // Ignore if already stopped
      }
      noiseSourceRef.current = null;
    }
  };

  const startAudio = () => {
    if (selectedPreset === 'none') return;
    stopAudio();

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const gainNode = ctx.createGain();
      const currentVol = isMuted ? 0 : volume / 100;
      gainNode.gain.setValueAtTime(currentVol * 0.15, ctx.currentTime);
      gainNode.connect(ctx.destination);
      gainNodeRef.current = gainNode;

      // Create ambient noise buffer (white/pink noise simulating rain/ocean)
      const bufferSize = ctx.sampleRate * 3; // 3 seconds buffer
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Biquad filter for soothing ambient sound texture
      const filter = ctx.createBiquadFilter();
      if (selectedPreset === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
      } else if (selectedPreset === 'ocean') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);
        filter.Q.setValueAtTime(1.0, ctx.currentTime);
      } else if (selectedPreset === 'lofi') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);
      } else {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, ctx.currentTime);
      }

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      whiteNoise.start();
      noiseSourceRef.current = whiteNoise;
      setIsPlaying(true);
    } catch (err) {
      console.warn('Web Audio synthesis not supported:', err);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      startAudio();
    }
  };

  const handleVolumeChange = (values: number[]) => {
    const val = values[0];
    setVolume(val);
    if (gainNodeRef.current && audioCtxRef.current) {
      const currentVol = isMuted ? 0 : val / 100;
      gainNodeRef.current.gain.setValueAtTime(currentVol * 0.15, audioCtxRef.current.currentTime);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (gainNodeRef.current && audioCtxRef.current) {
      const currentVol = nextMuted ? 0 : volume / 100;
      gainNodeRef.current.gain.setValueAtTime(currentVol * 0.15, audioCtxRef.current.currentTime);
    }
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    if (presetId === 'none') {
      stopAudio();
      setIsPlaying(false);
    } else if (isPlaying) {
      setTimeout(() => startAudio(), 100);
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <div className="bg-white border border-[#E6E4DF] rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-4 text-[#191918]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#F4F4F0] text-[#191918] border border-[#E6E4DF]">
            <Music className="w-4 h-4 text-[#191918]" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#191918] flex items-center gap-1.5">
              <span>Ambient Sound Mixer</span>
              <Sparkles className="w-3 h-3 text-amber-500" />
            </h4>
            <p className="text-[11px] text-[#666560]">
              Co-working background ambience for deep focus
            </p>
          </div>
        </div>

        {/* Play/Pause & Equalizer Indicator */}
        <div className="flex items-center gap-2">
          {isPlaying && (
            <div className="flex items-center gap-0.5 h-4 px-2">
              <span className="w-0.5 h-3 bg-[#191918] rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-0.5 h-4 bg-[#191918] rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-0.5 h-2 bg-[#191918] rounded-full animate-bounce" />
            </div>
          )}

          <button
            onClick={togglePlay}
            disabled={selectedPreset === 'none'}
            className={`p-2 px-3 rounded-xl font-medium transition flex items-center gap-1.5 text-xs cursor-pointer ${
              isPlaying
                ? 'bg-[#191918] text-white shadow-xs'
                : 'bg-[#F4F4F0] hover:bg-[#EFECE6] text-[#191918] border border-[#E6E4DF]'
            } ${selectedPreset === 'none' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause Audio' : 'Play Audio'}</span>
          </button>
        </div>
      </div>

      {/* Preset Tabs */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelectPreset(p.id)}
            className={`p-2 rounded-xl text-center border transition flex flex-col items-center gap-1 cursor-pointer ${
              selectedPreset === p.id
                ? 'bg-[#191918] text-white border-[#191918] shadow-xs font-medium'
                : 'bg-[#F4F4F0] border-[#E6E4DF] text-[#191918] hover:bg-[#EFECE6]'
            }`}
          >
            <span className="text-lg">{p.icon}</span>
            <span className="text-[11px] font-medium leading-none">{p.label}</span>
          </button>
        ))}
      </div>

      {/* Volume Slider */}
      {selectedPreset !== 'none' && (
        <div className="flex items-center gap-3 pt-1 border-t border-[#E6E4DF]">
          <button
            onClick={toggleMute}
            className="text-[#666560] hover:text-[#191918] transition cursor-pointer"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-600" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#191918]" />
            )}
          </button>
          <Slider
            value={[isMuted ? 0 : volume]}
            min={0}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="flex-1"
          />
          <span className="text-xs font-mono text-[#666560] w-8 text-right">
            {isMuted ? '0%' : `${volume}%`}
          </span>
        </div>
      )}
    </div>
  );
}
