'use client';

import { useState } from 'react';
import { OracleCard } from '@/types/oracle-card';
import { Spread } from '@/types/spread';
import { getCardById } from '@/data/oracle-cards-csv';
import { randomizeReversed } from '@/data/spreads';
import SpreadLayout from '@/components/SpreadLayout';

interface SpreadResultProps {
  spread: Spread;
  onBack: () => void;
  onSelectCard: (card: OracleCard, positionIndex: number, isReversed: boolean) => void;
}

interface CardInSpread {
  oracleCard: OracleCard;
  positionIndex: number;
  isReversed: boolean;
}

export default function SpreadResult({ spread, onBack, onSelectCard }: SpreadResultProps) {
  const [isShuffling, setIsShuffling] = useState(false);
  const [drawnCards, setDrawnCards] = useState<CardInSpread[]>([]);

  const handleShuffle = () => {
    setIsShuffling(true);
    setDrawnCards([]);

    setTimeout(() => {
      // 抽取卡片并随机正逆位
      const cards: CardInSpread[] = [];
      const allCards = Array.from({ length: 55 }, (_, i) => getCardById((i + 1).toString())).filter(Boolean) as OracleCard[];
      const shuffled = [...allCards].sort(() => Math.random() - 0.5);

      spread.positions.forEach((position, index) => {
        cards.push({
          oracleCard: shuffled[index],
          positionIndex: index,
          isReversed: randomizeReversed(),
        });
      });

      setDrawnCards(cards);
      setIsShuffling(false);
    }, 1500);
  };

  const handleCardClick = (cardInSpread: CardInSpread) => {
    onSelectCard(
      cardInSpread.oracleCard,
      cardInSpread.positionIndex,
      cardInSpread.isReversed,
    );
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-300 via-pink-300 to-amber-300 dark:from-purple-900 dark:via-pink-900 dark:to-amber-900">
      <button
        onClick={onBack}
        className="fixed top-4 left-4 z-50 px-4 py-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 backdrop-blur-sm rounded-full text-gray-700 dark:text-gray-200 font-medium transition-colors shadow-lg border border-amber-400/30 hover:border-amber-400"
      >
        ← 返回
      </button>

      {/* 洗牌和显示牌阵 */}
      {drawnCards.length === 0 ? (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
              {spread.name}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {spread.description}
            </p>
          </div>

          {isShuffling ? (
            <div className="flex justify-center items-center h-64 sm:h-80">
              <div className="relative w-32 sm:w-48 h-48 sm:h-72">
                {[...Array(Math.min(5, spread.cardCount))].map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-2xl border-2 border-amber-400/50"
                    style={{
                      animation: `shuffleCard 1.5s ease-in-out ${i * 0.1}s infinite`,
                      transformOrigin: 'center',
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={handleShuffle}
              disabled={isShuffling}
              className="group px-8 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-semibold text-lg sm:text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 border-amber-400/30 hover:border-amber-400"
            >
              {isShuffling ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  洗牌中...
                </span>
              ) : (
                '✨ 开始抽卡 ✨'
              )}
            </button>
          )}
        </div>
      ) : (
        <SpreadLayout
          spread={spread}
          drawnCards={drawnCards}
          onCardClick={handleCardClick}
        />
      )}

      {/* 重新洗牌按钮 */}
      {!isShuffling && drawnCards.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={handleShuffle}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 border-amber-300/50 text-sm sm:text-base"
          >
            🔄 重新洗牌
          </button>
        </div>
      )}
    </div>
  );
}
