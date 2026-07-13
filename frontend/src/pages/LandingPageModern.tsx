import { Suspense, useState } from 'react';
import { ModernHero } from '../components/landing-page-modern/hero/ModernHero';
import { DetailedFeaturesSection } from '../components/landing-page-modern/detailed-features/DetailedFeaturesSection';

import { FinalCTASection } from '../components/landing-page-modern/cta/FinalCTASection';
import { FooterSection } from '../components/landing-page-modern/footer/FooterSection';
import { Loader } from '../components/ui/Loader';
import Header from '../components/landing-page-modern/header/Header';
import TrailGrid from '../components/ui/trail-grid';
import { Settings as SettingsIcon } from 'lucide-react';

const LoadingFallback = () => (
  <div className="min-h-screen w-full bg-[#020202] flex items-center justify-center">
    <div className="text-center">
      <Loader message="Preparing your experience" size={50} />
    </div>
  </div>
);

export function LandingPageModern() {
  const [cellSize, setCellSize] = useState(40);
  const [duration, setDuration] = useState(150);
  const [bgColor, setBgColor] = useState("#05060a");
  const [cellColor, setCellColor] = useState("#e5e5e5");
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  const handleReset = () => {
    setCellSize(40);
    setDuration(150);
    setBgColor("#05060a");
    setCellColor("#e5e5e5");
  };

  return (
    <div 
      className="dark min-h-screen text-white overflow-x-hidden selection:bg-indigo-500 selection:text-white relative bg-[#05060A]"
      style={{
        transition: "background-color 0.3s ease",
      }}
    >
      <style>{`
        #controls-panel {
          transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
        }
        .panel-hidden {
          opacity: 0;
          transform: translateY(10px);
          visibility: hidden;
          pointer-events: none;
        }
        .panel-visible {
          opacity: 1;
          transform: translateY(0);
          visibility: visible;
          pointer-events: auto;
        }
      `}</style>

      <Suspense fallback={<LoadingFallback />}>
        {/* Background Interactive Grid (Stays Fixed, Perfect Squares) */}
        <TrailGrid
          cellSize={cellSize}
          duration={duration}
          cellColor={cellColor}
        />

        {/* Foreground Content */}
        <div className="relative z-10 flex-grow flex flex-col pointer-events-auto w-full">
          <Header />
          {/* Visually hidden h1 */}
          <h1 className="sr-only">
            FocusMaster — Free Pomodoro Timer, Task Manager &amp; Productivity Dashboard
          </h1>
          <main aria-label="FocusMaster productivity app landing page">
            <ModernHero />
            
            {/* Elements below the hero with standard stacking (no inversion) */}
            <div className="relative z-10">
              <div id="features" aria-label="Features">
                <DetailedFeaturesSection />
              </div>

              <FinalCTASection />
              <FooterSection />
            </div>
          </main>
        </div>

        {/* CONTROLS */}
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-auto">
          <div
            id="controls-panel"
            className={`mb-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-5 rounded-xl shadow-2xl w-64 text-sm text-slate-200 ${
              isPanelVisible ? "panel-visible" : "panel-hidden"
            }`}
          >
            <div className="mb-4">
              <label className="block text-slate-400 mb-1 flex justify-between">
                <span>BG Color</span>
                <span className="font-mono text-white uppercase">
                  {bgColor.toUpperCase()}
                </span>
              </label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
              />
            </div>
            <div className="mb-4">
              <label className="block text-slate-400 mb-1 flex justify-between">
                <span>Cell Color</span>
                <span className="font-mono text-white uppercase">
                  {cellColor.toUpperCase()}
                </span>
              </label>
              <input
                type="color"
                value={cellColor}
                onChange={(e) => setCellColor(e.target.value)}
                className="w-full h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
              />
            </div>
            <div className="mb-4">
              <label className="block text-slate-400 mb-1 flex justify-between">
                <span>Cell Size (px)</span>
                <span className="font-mono text-white">{cellSize}</span>
              </label>
              <input
                type="range"
                min="10"
                max="150"
                value={cellSize}
                onChange={(e) => setCellSize(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-slate-400 mb-1 flex justify-between">
                <span>Duration (ms)</span>
                <span className="font-mono text-white">{duration}</span>
              </label>
              <input
                type="range"
                min="50"
                max="2000"
                step="50"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-500"
              />
            </div>
            <button
              onClick={handleReset}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 rounded-lg transition-colors font-medium text-sm"
            >
              Reset to Defaults
            </button>
          </div>

          <button
            onClick={() => setIsPanelVisible(!isPanelVisible)}
            className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-full shadow-lg border border-slate-600 transition-colors flex items-center justify-center"
            title="Settings"
          >
            <SettingsIcon size={20} />
          </button>
        </div>
      </Suspense>
    </div>
  );
}
