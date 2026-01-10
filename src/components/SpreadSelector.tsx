'use client';

import { Spread } from '@/types/spread';
import { SPREADS } from '@/data/spreads';

interface SpreadSelectorProps {
  onSelectSpread: (spread: Spread) => void;
}

export default function SpreadSelector({ onSelectSpread }: SpreadSelectorProps) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-cinzel font-bold mb-3 sm:mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
          选择牌阵
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-playfair">
          选择适合你问题的牌阵，让草药的智慧指引你
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {SPREADS.map((spread) => (
          <button
            key={spread.id}
            onClick={() => onSelectSpread(spread)}
            className="group p-4 sm:p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-amber-400"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl sm:text-2xl bg-gradient-to-br ${
                  spread.cardCount === 1
                    ? 'from-amber-400 to-yellow-500'
                    : spread.cardCount === 3
                    ? 'from-purple-400 to-pink-500'
                    : 'from-blue-400 to-indigo-500'
                } text-white shadow-md`}
              >
                {spread.cardCount}
              </div>
              <div className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
                🔮
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-cinzel font-bold mb-2 text-gray-800 dark:text-gray-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {spread.name}
            </h3>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 font-playfair">
              {spread.description}
            </p>

            <div className="space-y-1">
              {spread.positions.map((position, index) => (
                <div
                  key={position.id}
                  className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500"
                >
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-xs sm:text-sm font-cinzel">
                    {index + 1}
                  </span>
                  <span className="font-playfair">{position.name}</span>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 sm:mt-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-3 sm:px-6 sm:py-3 bg-gradient-to-r from-amber-100 to-purple-100 dark:from-amber-900/30 dark:to-purple-900/30 rounded-full border border-amber-300 dark:border-amber-700/50">
          <span className="text-xl sm:text-2xl">💡</span>
          <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-playfair">
            每张卡片会随机选择正位或逆位，根据位置给出针对性解读
          </span>
        </div>
      </div>
    </div>
  );
}
