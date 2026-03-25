import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction, GameState } from '../types';
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, Pause } from 'lucide-react';

const SnakeGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }],
    food: { x: 5, y: 5 },
    direction: 'RIGHT',
    score: 0,
    isGameOver: false,
    isPaused: true,
  });

  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((snake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setGameState({
      snake: [{ x: 10, y: 10 }],
      food: { x: 5, y: 5 },
      direction: 'RIGHT',
      score: 0,
      isGameOver: false,
      isPaused: false,
    });
    setSpeed(INITIAL_SPEED);
  };

  const moveSnake = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver || prev.isPaused) return prev;

      const head = prev.snake[0];
      const newHead = { ...head };

      switch (prev.direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check wall collision
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        return { ...prev, isGameOver: true };
      }

      // Check self collision
      if (prev.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        return { ...prev, isGameOver: true };
      }

      const newSnake = [newHead, ...prev.snake];

      // Check food collision
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        const newScore = prev.score + 10;
        setSpeed(s => Math.max(MIN_SPEED, INITIAL_SPEED - (Math.floor(newScore / 50) * SPEED_INCREMENT)));
        return {
          ...prev,
          snake: newSnake,
          food: generateFood(newSnake),
          score: newScore,
        };
      }

      newSnake.pop();
      return { ...prev, snake: newSnake };
    });
  }, [generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setGameState(prev => prev.direction !== 'DOWN' ? { ...prev, direction: 'UP' } : prev);
          break;
        case 'ArrowDown':
          setGameState(prev => prev.direction !== 'UP' ? { ...prev, direction: 'DOWN' } : prev);
          break;
        case 'ArrowLeft':
          setGameState(prev => prev.direction !== 'RIGHT' ? { ...prev, direction: 'LEFT' } : prev);
          break;
        case 'ArrowRight':
          setGameState(prev => prev.direction !== 'LEFT' ? { ...prev, direction: 'RIGHT' } : prev);
          break;
        case ' ':
          setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    if (!gameState.isGameOver && !gameState.isPaused) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState.isGameOver, gameState.isPaused, moveSnake, speed]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_-12px_rgba(6,182,212,0.5)]">
      <div className="flex justify-between w-full items-center px-4">
        <div className="text-cyan-400 font-mono text-2xl tracking-widest">
          SCORE: <span className="text-white">{gameState.score}</span>
        </div>
        <button 
          onClick={() => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
          className="p-2 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-colors"
        >
          {gameState.isPaused ? <Play size={24} /> : <Pause size={24} />}
        </button>
      </div>

      <div 
        className="relative bg-slate-900/50 border-2 border-cyan-500/20 rounded-lg overflow-hidden"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Snake segments */}
        {gameState.snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            layoutId={`segment-${i}`}
            className={`absolute rounded-sm ${i === 0 ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-cyan-600/80'}`}
            style={{
              width: '20px',
              height: '20px',
              left: segment.x * 20,
              top: segment.y * 20,
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute bg-fuchsia-500 rounded-full shadow-[0_0_15px_#d946ef]"
          style={{
            width: '16px',
            height: '16px',
            left: gameState.food.x * 20 + 2,
            top: gameState.food.y * 20 + 2,
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {gameState.isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10"
            >
              <h2 className="text-fuchsia-500 text-4xl font-bold mb-4 tracking-tighter italic">GAME OVER</h2>
              <p className="text-cyan-400 mb-6 font-mono">FINAL SCORE: {gameState.score}</p>
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-all active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
              >
                <RotateCcw size={20} />
                RETRY
              </button>
            </motion.div>
          )}

          {gameState.isPaused && !gameState.isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10"
            >
              <button
                onClick={() => setGameState(prev => ({ ...prev, isPaused: false }))}
                className="p-6 bg-cyan-500/20 rounded-full text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30 transition-all"
              >
                <Play size={48} fill="currentColor" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-slate-500 text-xs font-mono uppercase tracking-[0.2em]">
        Use Arrow Keys to Move • Space to Pause
      </div>
    </div>
  );
};

export default SnakeGame;
