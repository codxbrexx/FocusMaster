import { useState } from 'react';
import { VolumeX, Headphones, CloudRain, Trees, Waves, Coffee, Play, Pause, Music } from 'lucide-react';

interface AmbientSoundMixerProps {
  preset?: string;
}

const SOUNDSCAPES = [
  { id: 'none', label: 'Off', icon: VolumeX },
  { id: 'rain', label: 'Rain', icon: CloudRain },
  { id: 'lofi', label: 'Lo-Fi Chill', icon: Headphones },
  { id: 'birds', label: 'Forest Birds', icon: Trees },
  { id: 'ocean', label: 'Ocean Waves', icon: Waves },
  { id: 'cafe', label: 'Cafe Ambient', icon: Coffee },
];

export function AmbientSoundMixer({ preset = 'none' }: AmbientSoundMixerProps) {
  const [selectedSoundscape, setSelectedSoundscape] = useState(preset);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-slate-600" />
            <h2 className="text-sm font-bold text-slate-900">Ambient Sound Mixer</h2>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Co-working background ambience for deep focus
          </p>
        </div>

        <button
          onClick={togglePlay}
          className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause Audio</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play Audio</span>
            </>
          )}
        </button>
      </div>

      {/* Soundscape Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
        {SOUNDSCAPES.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedSoundscape === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setSelectedSoundscape(item.id)}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 text-center font-semibold text-xs transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
              <span className="text-[11px] leading-tight font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
