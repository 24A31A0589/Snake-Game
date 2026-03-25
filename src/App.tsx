import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 blur-[120px] rounded-full" />
      </div>

      <header className="mb-12 text-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-block"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500 mb-2">
            Neon <span className="text-cyan-400">Snake</span> & <span className="text-fuchsia-500">Beats</span>
          </h1>
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
        </motion.div>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Game Section - Center/Left */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-7 flex justify-center"
        >
          <SnakeGame />
        </motion.div>

        {/* Music Section - Right */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-5 flex flex-col gap-6 items-center lg:items-start"
        >
          <div className="w-full">
            <h2 className="text-xs font-mono uppercase tracking-[0.4em] text-slate-500 mb-4 px-2">
              Now Playing
            </h2>
            <MusicPlayer />
          </div>

          <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-cyan-400 mb-2 uppercase tracking-wider">Instructions</h3>
            <ul className="text-sm text-slate-400 space-y-2 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                Eat the <span className="text-fuchsia-500">pink dots</span> to grow and score.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                Avoid hitting the walls or yourself.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                The game speeds up as your score increases.
              </li>
            </ul>
          </div>
        </motion.div>
      </main>

      <footer className="mt-16 text-slate-600 text-[10px] font-mono uppercase tracking-[0.3em]">
        Built with Google AI Studio • 2026
      </footer>
    </div>
  );
}
