'use client';

import { OracleCard } from '@/types/oracle-card';
import { Spread } from '@/types/spread';

interface CardInSpread {
  oracleCard: OracleCard;
  positionIndex: number;
  isReversed: boolean;
}

interface SpreadLayoutProps {
  spread: Spread;
  drawnCards: CardInSpread[];
  onCardClick: (cardInSpread: CardInSpread) => void;
}

export default function SpreadLayout({ spread, drawnCards, onCardClick }: SpreadLayoutProps) {
  // 统一卡片样式
  const cardStyle = {
    width: '220px',
    height: '320px',
  };

  // 根据牌阵类型返回布局类名
  const getLayoutClasses = () => {
    switch (spread.cardCount) {
      case 1:
        return 'justify-center items-center';
      case 3:
        return spread.id === 'mind-body-spirit'
          ? 'relative' // 三角形用绝对定位
          : 'flex-row justify-center items-center gap-6 sm:gap-10'; // 横向
      case 4:
        return 'grid grid-cols-2 gap-6 sm:gap-10 justify-items-center';
      case 5:
        return 'relative'; // 钻石形用绝对定位
      default:
        return 'flex-wrap justify-center gap-6';
    }
  };

  // 获取卡片的绝对定位样式
  const getCardPositionStyles = (index: number, cardCount: number): React.CSSProperties => {
    if (cardCount === 1) return {};

    if (cardCount === 3 && spread.id === 'mind-body-spirit') {
      // 三角形布局：顶部中间一张，底部两张左右分开
      if (index === 0) {
        return { position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' };
      } else if (index === 1) {
        return { position: 'absolute', bottom: '0', left: '10%' };
      } else {
        return { position: 'absolute', bottom: '0', right: '10%' };
      }
    }

    if (cardCount === 5) {
      // 钻石形布局
      if (index === 0) {
        return { position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)' };
      } else if (index === 1) {
        return { position: 'absolute', top: '140px', left: '0%' };
      } else if (index === 2) {
        return { position: 'absolute', top: '140px', right: '0%' };
      } else if (index === 3) {
        return { position: 'absolute', bottom: '0', left: '20%' };
      } else {
        return { position: 'absolute', bottom: '0', right: '20%' };
      }
    }

    return {};
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* 牌阵标题 */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent animate-fade-in">
          {spread.name}
        </h1>
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto px-4 font-playfair animate-fade-in-up">
          {spread.description}
        </p>
      </div>

      {/* 牌阵布局容器 */}
      <div
        className={`flex min-h-[500px] ${getLayoutClasses()}`}
        style={
          (spread.cardCount === 3 && spread.id === 'mind-body-spirit') || spread.cardCount === 5
            ? { width: '550px', height: '550px', margin: '0 auto' }
            : {}
        }
      >
        {drawnCards.map((cardInSpread, index) => {
          const position = spread.positions[index];
          const positionStyles = getCardPositionStyles(index, spread.cardCount);

          return (
            <div
              key={index}
              onClick={() => onCardClick(cardInSpread)}
              className="cursor-pointer transition-all duration-300 hover:scale-110 group animate-fade-in"
              style={{
                ...positionStyles,
                animationDelay: `${index * 0.15}s`,
              }}
            >
              {/* 卡片容器 */}
              <div
                className="herb-card rounded-2xl shadow-2xl relative overflow-hidden border-3 border-amber-400/80 hover:border-amber-400 transition-all duration-300 animate-float"
                style={{
                  ...cardStyle,
                  transform: cardInSpread.isReversed ? 'rotate(180deg)' : 'none',
                  backgroundColor: '#fff',
                }}
              >
                {/* 卡片图片 */}
                {cardInSpread.oracleCard.imageUrl && !cardInSpread.oracleCard.imageUrl.includes('placeholder.url') ? (
                  <img
                    src={cardInSpread.oracleCard.imageUrl}
                    alt={cardInSpread.oracleCard.name}
                    className="w-full h-[70%] object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-[70%] bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <div className="text-7xl">🌿</div>
                  </div>
                )}

                {/* 卡片名称和拉丁名 */}
                <div className="h-[30%] p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/50 dark:to-orange-900/50">
                  <h3 className="text-lg font-cinzel font-bold text-center text-amber-800 dark:text-amber-200 mb-1 truncate">
                    {cardInSpread.oracleCard.name}
                  </h3>
                  <p className="text-sm font-playfair text-center text-amber-600 dark:text-amber-400 italic truncate">
                    {cardInSpread.oracleCard.latinName}
                  </p>
                </div>

                {/* 正逆位指示 */}
                {cardInSpread.isReversed && (
                  <div className="absolute top-3 right-3 w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg animate-pulse-gold">
                    ⬇
                  </div>
                )}

                {/* 悬停提示 */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ backgroundColor: 'rgba(212, 175, 55, 0.7)' }}>
                  <div className="text-white text-center px-4">
                    <div className="text-3xl mb-2">👁</div>
                    <p className="font-cinzel font-bold">点击查看解读</p>
                  </div>
                </div>
              </div>

              {/* 位置标签 */}
              <div className="mt-3 text-center animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-200 to-amber-300 dark:from-amber-900/70 dark:to-amber-800/70 rounded-full border-2 border-amber-400/60 shadow-lg hover:shadow-xl transition-shadow">
                  <span className="text-amber-800 dark:text-amber-200 font-bold font-cinzel">{index + 1}</span>
                  <span className="text-amber-900 dark:text-amber-100 font-semibold font-playfair">{position.name}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
