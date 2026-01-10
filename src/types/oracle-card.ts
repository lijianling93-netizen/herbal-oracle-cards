export interface OracleCard {
  id: string;
  name: string;
  latinName: string;
  category: string;
  planetaryGroupArchetype: string;
  archetype: string;
  uprightKeywords: string[];
  reversedKeywords: string[];
  properties: string;
  physicalDimension: string;
  psychologicalDimension: string;
  spiritualDimension: string;
  imageUrl: string;
  displayName?: string; // 显示名称（序号+中文名+核心关键词），可选
  color?: string; // 用于UI渐变色，可选
  interpretation?: string; // 正位解读，可选
  reversedInterpretation?: string; // 逆位解读，可选
  practicalGuidance?: string; // 实践指引，可选
  spiritualInsight?: string; // 灵性洞察，可选
  planet?: string; // 行星，可选
  zodiac?: string; // 星座，可选
  element?: string; // 元素，可选
}

// 用于CSV解析的接口
export interface OracleCardCSV {
  ID: string;
  Name: string;
  Latin_Name: string;
  Category: string;
  Planetary_Group_Archetype: string;
  Archetype: string;
  Upright_Keywords: string;
  Reversed_Keywords: string;
  Properties: string;
  Physical_Dimension: string;
  Psychological_Dimension: string;
  Spiritual_Dimension: string;
  Image_URL: string;
}
