'use client';

import { useState } from 'react';
import CardInterpretation from '@/components/CardInterpretation';
import { OracleCard } from '@/types/oracle-card';

export default function TestSouthNodePage() {
  const [showCard, setShowCard] = useState(false);

  // 测试南交点牌卡（第55号 - 圣木）
  const testCard: OracleCard = {
    id: '55',
    name: '圣木 (Palo Santo)',
    latinName: 'Bursera graveolens',
    category: '月亮交点草药卡',
    planetaryGroupArchetype: '南交点/冥王星',
    archetype: '南交点/冥王星',
    uprightKeywords: ['保护', '净化'],
    reversedKeywords: ['沉溺于过去', '受困于旧的业力模式', '无法实现新的成长'],
    properties: '净化能量场、清除负面能量、仪式用途',
    physicalDimension: '净化身体空间、改善睡眠质量、增强免疫力',
    psychologicalDimension: '清除心理毒素、释放创伤、心灵净化',
    spiritualDimension: '连接灵性世界、冥想辅助、能量平衡',
    imageUrl: '/cards/55-palosanto.jpg',
    displayName: '55 圣木 净化'
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '1rem',
          fontFamily: 'Georgia, serif',
          color: '#4a4139'
        }}>
          南交点牌卡测试
        </h1>

        <p style={{
          marginBottom: '2rem',
          color: '#8b8176',
          lineHeight: '1.6'
        }}>
          点击下方按钮查看第55号牌卡（圣木 - 南交点/冥王星）的解读页面。
          <br /><br />
          应该能看到：<strong>【交点能量：天赋与业力】代表前世的天赋（南交点）与需要释放的业力遗留。</strong>
        </p>

        {!showCard ? (
          <button
            onClick={() => setShowCard(true)}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              background: '#4a7c59',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'Georgia, serif',
              boxShadow: '0 2px 8px rgba(74, 124, 89, 0.3)'
            }}
          >
            查看南交点牌卡
          </button>
        ) : (
          <CardInterpretation
            card={testCard}
            isReversed={false}
            onBack={() => setShowCard(false)}
            onBackToHome={() => setShowCard(false)}
            intention="测试南交点牌卡显示"
          />
        )}
      </div>
    </div>
  );
}
