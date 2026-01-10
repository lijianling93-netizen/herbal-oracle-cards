// 行星组解读映射表
// 根据朱迪斯·希尔医疗占星框架，行星作为"生理动词"，解读每张卡牌背后的行星组合意义

export interface PlanetGroupInterpretation {
  planet: string;           // 行星名称
  description: string;      // 该行星组的统一解读
  keywords: string[];       // 关键词
  cardCount: number;        // 该组的卡牌数量
}

export const PLANET_GROUPS: PlanetGroupInterpretation[] = [
  {
    planet: '太阳',
    description: '太阳代表生命力的源泉、创造力和自我认同。引导我们增强生命力、建立自信、展现领导力，并在黑暗中保持希望。',
    keywords: ['生命力', '创造力', '自我认同', '希望', '领导力'],
    cardCount: 5
  },
  {
    planet: '月亮',
    description: '月亮掌管情感、直觉、潜意识与滋养。探索情感的流动性、内在疗愈、梦境指引，以及如何与内在的柔软力量建立连接。',
    keywords: ['情感', '直觉', '潜意识', '滋养', '梦境'],
    cardCount: 5
  },
  {
    planet: '金星',
    description: '金星代表爱、美、和谐与价值。指导我们如何建立健康的关系、平衡能量、欣赏美丽，并在生命中创造丰盛与喜悦。',
    keywords: ['爱', '美', '和谐', '关系', '价值'],
    cardCount: 5
  },
  {
    planet: '水星',
    description: '水星掌管沟通、心智、记忆与学习。帮助提升清晰思维、表达力、专注力，以及在变化中保持灵活与智慧。',
    keywords: ['沟通', '心智', '记忆', '学习', '智慧'],
    cardCount: 5
  },
  {
    planet: '火星',
    description: '火星代表行动、勇气、驱动力与保护。激发内在的力量、决断力、边界设定，以及将意图转化为行动的勇气。',
    keywords: ['行动', '勇气', '驱动力', '保护', '决断'],
    cardCount: 5
  },
  {
    planet: '木星',
    description: '木星象征扩展、智慧、丰盛与好运。引导我们提升信念、开拓视野、吸引好运，并在生活中体验更多的可能性。',
    keywords: ['扩展', '智慧', '丰盛', '好运', '可能性'],
    cardCount: 5
  },
  {
    planet: '土星',
    description: '土星代表结构、纪律、学习与成长。教导我们如何建立坚实基础、承担责任、跨越障碍，并将压力转化为力量。',
    keywords: ['结构', '纪律', '成长', '责任', '转化'],
    cardCount: 5
  },
  {
    planet: '天王星',
    description: '天王星象征变革、创新、觉醒与自由。帮助我们打破旧有模式、拥抱变化、发现独特天赋，并在颠覆中找到新的方向。',
    keywords: ['变革', '创新', '觉醒', '自由', '天赋'],
    cardCount: 5
  },
  {
    planet: '海王星',
    description: '海王星代表灵感、直觉、梦想与超越。连接我们的精神维度、艺术灵感、直觉指引，并在物质世界中体验神圣的美。',
    keywords: ['灵感', '直觉', '梦想', '超越', '神圣'],
    cardCount: 5
  },
  {
    planet: '冥王星',
    description: '冥王星象征转化、重生、深度与真相。引导我们穿越阴影、释放旧我、实现蜕变，并在毁灭中发现重生的力量。',
    keywords: ['转化', '重生', '深度', '真相', '蜕变'],
    cardCount: 5
  },
  {
    planet: '凯龙星',
    description: '凯龙星代表疗愈、创伤、智慧与导师。揭示我们的核心创伤、疗愈之路、内在智慧，以及将痛苦转化为慈悲的力量。',
    keywords: ['疗愈', '创伤', '智慧', '导师', '慈悲'],
    cardCount: 5
  },
  {
    planet: '黑月莉莉丝',
    description: '黑月莉莉丝代表野性的女性能量、原始激情与反抗。连接我们内在的叛逆力量、被压抑的阴影面、原始的女性直觉，以及在界限中找到真正的自由。',
    keywords: ['野性', '女性能量', '原始激情', '反抗', '阴影面'],
    cardCount: 1
  },
  {
    planet: '谷神星',
    description: '谷神星象征母性、滋养、成长与保护。引导我们如何像母亲一样关怀自己和他人、创造安全的成长环境、建立健康的边界，以及将痛苦转化为疗愈的力量。',
    keywords: ['母性', '滋养', '成长', '保护', '关怀'],
    cardCount: 1
  },
  {
    planet: '北交点',
    description: '北交点代表灵魂进化的方向、未来的使命与成长。指引我们走出舒适区、面对新的挑战、发展潜在的天赋，并在这一世中实现灵性的升华。',
    keywords: ['使命', '进化', '成长', '未来', '潜能'],
    cardCount: 1
  },
  {
    planet: '南交点',
    description: '南交点代表前世的天赋、业力遗留与熟悉的领域。帮助我们识别前世积累的优势、需要释放的业力模式、重复的主题，并将旧有经验转化为新生的力量。',
    keywords: ['天赋', '业力', '前世', '经验', '转化'],
    cardCount: 1
  }
];

// 根据行星名称获取解读
export function getPlanetGroupInterpretation(planet: string): PlanetGroupInterpretation | undefined {
  return PLANET_GROUPS.find(group => group.planet === planet);
}
