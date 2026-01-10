'use client';

import { OracleCard } from '@/types/oracle-card';
import CardInterpretation from '@/components/CardInterpretation';

// 获取一张测试卡片
const testCard: OracleCard = {
  id: "1",
  name: "金盏花",
  latinName: "Calendula officinalis",
  category: "太阳草药卡",
  planetaryGroupArchetype: "【太阳：生命力与意识中心】关于自我的核心、光芒与纯粹的生命意志。象征\"我即存在\"。",
  archetype: "太阳",
  uprightKeywords: ["纯真", "孩童般的喜悦", "谦逊", "纯洁", "新的开始", "对生活的信任", "活力"],
  reversedKeywords: ["失去纯真", "缺乏心态", "无力实现目标", "抗拒新的开始"],
  properties: "发汗药/中和毒性",
  physicalDimension: "调节心脏功能、强化基本代谢",
  psychologicalDimension: "建立自信与对生活的信任、克服匮乏心态",
  spiritualDimension: "纯真与新的开始；在仪式中作为超级导体放大意图",
  imageUrl: "http://placeholder.url/1.jpg",
  interpretation: "正位关键词：纯真、孩童般的喜悦、谦逊、纯洁、新的开始、对生活的信任、活力\n\n在太阳的能量加持下，金盏花为你带来这份指引：\n\n• 物理层面：调节心脏功能、强化基本代谢\n• 心理层面：建立自信与对生活的信任、克服匮乏心态\n• 精神层面：纯真与新的开始；在仪式中作为超级导体放大意图\n\n草药特性：发汗药/中和毒性",
  reversedInterpretation: "逆位关键词：失去纯真、缺乏心态、无力实现目标、抗拒新的开始\n\n金盏花逆位时提醒你：失去纯真。这份能量可能被阻断，但也是重新审视的机会。\n\n• 重新评估你的方向\n• 释放不再服务于你的模式\n• 找回内在的力量\n\n请记住，逆位并非坏事，而是宇宙温柔的提醒，邀请你回归平衡。",
  practicalGuidance: "【实践建议】\n\n1. 每日冥想：连接太阳的能量，感受火元素的力量\n2. 草药使用：利用金盏花的发汗药/中和毒性特性\n3. 星座指引：狮子座的能量可以帮助你整合这份智慧\n4. 元素平衡：多接触火元素的事物，保持身心平衡",
  spiritualInsight: "【灵性洞察】\n\n纯真与新的开始；在仪式中作为超级导体放大意图\n\n在太阳的照耀下，金盏花作为太阳的代表，为你揭示灵魂深处的智慧。火元素与狮子座的能量交织，指引你走向更高的意识境界。\n\n此刻，宇宙以独特的方式与你对话，请用心聆听内心的声音。",
  planet: "太阳",
  zodiac: "狮子座",
  element: "火",
};

export default function TestCardPage() {
  const handleBack = () => {
    alert('返回功能正常');
  };

  return (
    <main className="min-h-screen">
      <CardInterpretation
        card={testCard}
        isReversed={false}
        onBack={handleBack}
      />
    </main>
  );
}
