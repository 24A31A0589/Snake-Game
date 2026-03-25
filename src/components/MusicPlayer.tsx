import React, { useState, useRef, useEffect } from 'react';
import { Track } from '../types';
import { DUMMY_TRACKS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-md bg-black/40 backdrop-blur-xl rounded-3xl border border-fuchsia-500/30 p-6 shadow-[0_0_50px_-12px_rgba(217,70,239,0.5)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      <div className="flex items-center gap-6 mb-8">
        <motion.div 
          key={currentTrack.id}
          initial={{ rotate: -10, scale: 0.9, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          className="relative w-32 h-32 flex-shrink-0"
        >
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title}
            className="w-full h-full object-cover rounded-2xl border border-fuchsia-500/50 shadow-[0_0_20px_rgba(217,70,239,0.3)]"
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute -bottom-2 -right-2 bg-fuchsia-500 p-2 rounded-full shadow-lg">
              <Music size={16} className="text-black animate-bounce" />
            </div>
          )}
        </motion.div>

        <div className="flex-1 overflow-hidden">
          <motion.h3 
            key={`title-${currentTrack.id}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-white text-xl font-bold truncate tracking-tight"
          >
            {currentTrack.title}
          </motion.h3>
          <motion.p 
            key={`artist-${currentTrack.id}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-fuchsia-400 text-sm font-mono uppercase tracking-widest"
          >
            {currentTrack.artist}
          </motion.p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="relative h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-fuchsia-500 to-cyan-400"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button className="text-slate-500 hover:text-fuchsia-400 transition-colors">
            <Volume2 size={20} />
          </button>

          <div className="flex items-center gap-6">
            <button 
              onClick={prevTrack}
              className="p-2 text-white hover:text-fuchsia-400 transition-all active:scale-90"
            >
              <SkipBack size={28} fill="currentColor" />
            </button>

            <button 
              onClick={togglePlay}
              className="w-16 h-16 flex items-center justify-center bg-fuchsia-500 text-black rounded-full hover:bg-fuchsia-400 transition-all active:scale-95 shadow-[0_0_25px_rgba(217,70,239,0.6)]"
            >
              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>

            <button 
              onClick={nextTrack}
              className="p-2 text-white hover:text-fuchsia-400 transition-all active:scale-90"
            >
              <SkipForward size={28} fill="currentColor" />
            </button>
          </div>

          <div className="w-5" /> {/* Spacer */}
        </div>

        {/* Track List */}
        <div className="pt-4 border-t border-slate-800/50">
          <div className="flex flex-col gap-2">
            {DUMMY_TRACKS.map((track, idx) => (
              <button
                key={track.id}
                onClick={() => {
                  setCurrentTrackIndex(idx);
                  setIsPlaying(true);
                }}
                className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                  idx === currentTrackIndex 
                    ? 'bg-fuchsia-500/10 text-fuchsia-400' 
                    : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono opacity-50">0{idx + 1}</span>
                  <span className="text-sm font-medium">{track.title}</span>
                </div>
                {idx === currentTrackIndex && isPlaying && (
                  <div className="flex gap-0.5 h-3 items-end">
                    {[1, 2, 3].map(i => (
                      <motion.div
                        key={i}
                        animate={{ height: [4, 12, 4] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                        className="w-0.5 bg-fuchsia-500"
                      />
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
