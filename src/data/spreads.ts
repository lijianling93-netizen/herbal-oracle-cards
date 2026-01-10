import { Spread } from '@/types/spread';

// 牌阵配置
export const SPREADS: Spread[] = [
  {
    id: 'single',
    name: '单卡指引',
    description: '抽一张卡，获得当下的直觉指引',
    cardCount: 1,
    positions: [
      {
        id: 'present',
        name: '当下指引',
        description: '这代表你当前的状况和需要关注的核心能量',
      },
    ],
  },
  {
    id: 'past-present-future',
    name: '三张卡：时间流',
    description: '探索过去、现在与未来的能量流动',
    cardCount: 3,
    positions: [
      {
        id: 'past',
        name: '过去',
        description: '这代表影响你的过去经历或业力',
      },
      {
        id: 'present',
        name: '现在',
        description: '这代表你当前的处境和能量状态',
      },
      {
        id: 'future',
        name: '未来',
        description: '这代表可能的发展方向和结果',
      },
    ],
  },
  {
    id: 'five-elements',
    name: '五张卡：行动指南',
    description: '全面分析问题并获取行动建议',
    cardCount: 5,
    positions: [
      {
        id: 'situation',
        name: '当前状况',
        description: '你现在的处境和主要问题',
      },
      {
        id: 'challenge',
        name: '挑战/障碍',
        description: '你需要克服的障碍或挑战',
      },
      {
        id: 'advice',
        name: '建议',
        description: '灵性给出的建议和指引',
      },
      {
        id: 'action',
        name: '行动',
        description: '建议你采取的具体行动',
      },
      {
        id: 'outcome',
        name: '结果',
        description: '按照建议行动后可能达到的结果',
      },
    ],
  },
  {
    id: 'mind-body-spirit',
    name: '三张卡：身心灵',
    description: '探索物理、心理与精神层面的平衡',
    cardCount: 3,
    positions: [
      {
        id: 'body',
        name: '身体',
        description: '你的身体状态和能量流动',
      },
      {
        id: 'mind',
        name: '心理',
        description: '你的思维模式和情绪状态',
      },
      {
        id: 'spirit',
        name: '精神',
        description: '你的灵性成长和内在智慧',
      },
    ],
  },
  {
    id: 'decision-making',
    name: '四张卡：决策辅助',
    description: '帮助你做出重要决定',
    cardCount: 4,
    positions: [
      {
        id: 'current',
        name: '当前情况',
        description: '你现在的处境',
      },
      {
        id: 'option1',
        name: '选择A',
        description: '第一个选项的能量和结果',
      },
      {
        id: 'option2',
        name: '选择B',
        description: '第二个选项的能量和结果',
      },
      {
        id: 'guidance',
        name: '指引',
        description: '灵性的最终指引和建议',
      },
    ],
  },
];

// 根据ID获取牌阵
export const getSpreadById = (id: string): Spread | undefined => {
  return SPREADS.find(spread => spread.id === id);
};

// 随机选择正位或逆位
export const randomizeReversed = (): boolean => {
  return Math.random() < 0.4; // 40%概率是逆位
};
