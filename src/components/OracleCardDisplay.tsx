'use client';

import { useState } from 'react';
import { OracleCard } from '@/types/oracle-card';
import { getRandomCard, getMultipleCards } from '@/data/oracle-cards-csv';

interface OracleCardDisplayProps {
  onSelectCard: (card: OracleCard) => void;
}

export default function OracleCardDisplay({ onSelectCard }: OracleCardDisplayProps) {
  const [isShuffling, setIsShuffling] = useState(false);
  const [drawnCards, setDrawnCards] = useState<OracleCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());

  const handleShuffle = () => {
    setIsShuffling(true);
    setDrawnCards([]);
    setSelectedCards(new Set());

    setTimeout(() => {
      const cards = getMultipleCards(5);
      setDrawnCards(cards);
      setIsShuffling(false);
    }, 1500);
  };

  const handleCardClick = (card: OracleCard) => {
    setSelectedCards(new Set([card.id]));
    setTimeout(() => {
      onSelectCard(card);
    }, 300);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
          草药占星神谕卡
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          草药与占星结合的古老智慧，为你指引道路
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <button
          onClick={handleShuffle}
          disabled={isShuffling}
          className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isShuffling ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              洗牌中...
            </span>
          ) : drawnCards.length > 0 ? (
            '重新洗牌'
          ) : (
            '开始抽卡'
          )}
        </button>
      </div>

      {isShuffling && (
        <div className="flex justify-center items-center h-64">
          <div className="relative w-40 h-60">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-xl"
                style={{
                  animation: `shuffleCard 1.5s ease-in-out ${i * 0.1}s infinite`,
                  transformOrigin: 'center',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {!isShuffling && drawnCards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center">
          {drawnCards.map((card, index) => {
            const isSelected = selectedCards.has(card.id);
            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className="relative cursor-pointer group"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <div
                  className={`w-48 h-72 rounded-2xl shadow-xl transform transition-all duration-300 ${
                    isSelected
                      ? 'scale-105 ring-4 ring-amber-400'
                      : 'group-hover:scale-105 group-hover:-translate-y-2'
                  }`}
                >
                  <div
                    className={`w-full h-full bg-gradient-to-br ${card.color || 'from-purple-400 to-pink-500'} rounded-2xl p-3 flex flex-col`}
                  >
                    {/* 图片区域 */}
                    <div className="flex-1 flex items-center justify-center overflow-hidden rounded-lg mb-2 bg-white/20">
                      {card.imageUrl && !card.imageUrl.includes('placeholder.url') ? (
                        <img
                          src={card.imageUrl}
                          alt={card.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="text-4xl">🌿</div>
                      )}
                    </div>

                    {/* 卡牌信息 */}
                    <div className="text-white text-center">
                      <div className="text-sm font-bold mb-1 leading-tight">{card.name}</div>
                      <div className="text-xs opacity-80 truncate">{card.latinName}</div>
                    </div>

                    {/* 底部信息 */}
                    <div className="flex justify-between items-center text-white/80 text-xs mt-2">
                      <span className="font-medium">{card.archetype}</span>
                      <span className="text-lg">✨</span>
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <span className="text-white">✓</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!isShuffling && drawnCards.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔮</div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            点击上方按钮开始你的占卜之旅
          </p>
        </div>
      )}
    </div>
  );
}
