import { OracleCard, OracleCardCSV } from '@/types/oracle-card';
import { getDetailedInterpretation } from './oracle-interpretations';

// 获取卡片对应的图片URL
export const getCardImageUrl = (cardId: string): string => {
  // 尝试匹配不同格式的图片文件名
  const imageNames = [
    `${cardId}.`,
    `${cardId} `,
  ];

  // 由于我们不知道确切的文件名格式，这里提供一个通用的映射逻辑
  // 实际使用时，可以根据具体的文件名格式进行调整
  return `/cards/${imageNames[0]}*.jpg`; // 这里的路径需要根据实际的文件列表来调整
};

// 图片URL映射表（基于实际文件名）
const CARD_IMAGE_MAP: Record<string, string> = {
  '1': '/cards/1-calendula.jpg',
  '2': '/cards/2-stjohnswort.jpg',
  '3': '/cards/3-rosemary.jpg',
  '4': '/cards/4-rue.jpg',
  '5': '/cards/5-bluelotus.jpg',
  '6': '/cards/6-sage.jpg',
  '7': '/cards/7-lapacho.jpg',
  '8': '/cards/8-bobinsana.jpg',
  '9': '/cards/9-chamomile.jpg',
  '10': '/cards/10-mugwort.jpg',
  '11': '/cards/11-damiana.jpg',
  '12': '/cards/12-rose.jpg',
  '13': '/cards/13-motherwort.jpg',
  '14': '/cards/14-hibiscus.jpg',
  '15': '/cards/15-yarrow.jpg',
  '16': '/cards/16-mucuna.jpg',
  '17': '/cards/17-gotukola.jpg',
  '18': '/cards/18-lionsmane.jpg',
  '19': '/cards/19-holybasil.jpg',
  '20': '/cards/20-lavender.jpg',
  '21': '/cards/21-nettle.jpg',
  '22': '/cards/22-jergon-sacha.jpg',
  '23': '/cards/23-milk-thistle.jpg',
  '24': '/cards/24-tobacco.jpg',
  '25': '/cards/25-catsclaw.jpg',
  '26': '/cards/26-cordyceps.jpg',
  '27': '/cards/27-reishi.jpg',
  '28': '/cards/28-elderberry.jpg',
  '29': '/cards/29-schisandra.jpg',
  '30': '/cards/30-echinacea.jpg',
  '31': '/cards/31-cannabis.jpg',
  '32': '/cards/32-comfrey.jpg',
  '33': '/cards/33-arnica.jpg',
  '34': '/cards/34-kratom.jpg',
  '35': '/cards/35-horsetail.jpg',
  '36': '/cards/36-coca.jpg',
  '37': '/cards/37-rhodiola.jpg',
  '38': '/cards/38-cacao.jpg',
  '39': '/cards/39-ginkgo.jpg',
  '40': '/cards/40-ginseng.jpg',
  '41': '/cards/41-poppy.jpg',
  '42': '/cards/42-amanita.jpg',
  '43': '/cards/43-passionflower.jpg',
  '44': '/cards/44-valerian.jpg',
  '45': '/cards/45-mandrake.jpg',
  '46': '/cards/46-brugmansia.jpg',
  '47': '/cards/47-skullcap.jpg',
  '48': '/cards/48-kavakava.jpg',
  '49': '/cards/49-psilocybe.jpg',
  '50': '/cards/50-ayahuasca.jpg',
  '51': '/cards/51-blackmoonlilith.jpg',
  '52': '/cards/52-ceres.jpg',
  '53': '/cards/53-chiron.jpg',
  '54': '/cards/54-ashwagandha.jpg',
  '55': '/cards/55-palosanto.jpg',
};

// CSV格式原始数据
const csvData: OracleCardCSV[] = [
  {
    ID: "1",
    Name: "金盏花 (Calendula)",
    Latin_Name: "Calendula officinalis",
    Category: "太阳草药卡",
    Planetary_Group_Archetype: "【太阳：生命力与意识中心】关于自我的核心、光芒与纯粹的生命意志。象征\"我即存在\"。",
    Archetype: "太阳",
    Upright_Keywords: "纯真、孩童般的喜悦、谦逊、纯洁、新的开始、对生活的信任、活力",
    Reversed_Keywords: "失去纯真、缺乏心态、无力实现目标、抗拒新的开始",
    Properties: "发汗药，中和毒素，增强基本代谢",
    Physical_Dimension: "支持心脏，调节发烧时的出汗反应",
    Psychological_Dimension: "正位表现为孩童般的信任；逆位则陷入匮乏心态，抗拒新开始",
    Spiritual_Dimension: "纯净的创造冲动，放大疗愈意图",
    Image_URL: "http://placeholder.url/1.jpg"
  },
  {
    ID: "2",
    Name: "圣约翰草 (St. John's Wort)",
    Latin_Name: "Hypericum perforatum",
    Category: "太阳草药卡",
    Planetary_Group_Archetype: "【太阳：生命力与意识中心】关于自我的核心、光芒与纯粹的生命意志。象征\"我即存在\"。",
    Archetype: "太阳",
    Upright_Keywords: "喜悦、温暖、韧性、幸福、理解、显化、精神力量、保护",
    Reversed_Keywords: "不快乐、逃避、回避、逃跑、不走自己的正道",
    Properties: "抗病毒，提升神经系统光照度",
    Physical_Dimension: "缓解抑郁和慢性疼痛，支持伤口愈合",
    Psychological_Dimension: "正位代表韧性与温暖；逆位则是逃避现实或不走正道",
    Spiritual_Dimension: "精神保护屏障，指引灵魂穿越阴影",
    Image_URL: "http://placeholder.url/2.jpg"
  },
  {
    ID: "3",
    Name: "迷迭香 (Rosemary)",
    Latin_Name: "Rosmarinus officinalis",
    Category: "太阳草药卡",
    Planetary_Group_Archetype: "【太阳：生命力与意识中心】关于自我的核心、光芒与纯粹的生命意志。象征\"我即存在\"。",
    Archetype: "太阳/水星",
    Upright_Keywords: "记忆、古老的记忆、多维视野、回忆、承诺、对愿景的忠诚",
    Reversed_Keywords: "怀旧、迷失、因情感创伤导致的疏离、诱发性遗忘、过去情感的浮现、困惑",
    Properties: "增强大脑循环，修复记忆通路",
    Physical_Dimension: "调节认知功能，舒缓压力导致的疏离",
    Psychological_Dimension: "正位为对愿景的忠诚；逆位则是情感创伤导致的诱发性遗忘",
    Spiritual_Dimension: "连接自我与超我，触及DNA中的祖先记忆",
    Image_URL: "http://placeholder.url/3.jpg"
  },
  {
    ID: "4",
    Name: "芸香草 (Rue)",
    Latin_Name: "Ruta graveolens",
    Category: "太阳草药卡",
    Planetary_Group_Archetype: "【太阳：生命力与意识中心】关于自我的核心、光芒与纯粹的生命意志。象征\"我即存在\"。",
    Archetype: "太阳/冥王星",
    Upright_Keywords: "精神屏障、灵性保护、天使智慧、驱逐黑暗、恢复活力",
    Reversed_Keywords: "灵性附身、寄生能量、愤怒、自我批评、评判、自我厌恶",
    Properties: "强力解毒，驱逐寄生性负面能量",
    Physical_Dimension: "调理月经，改善视力，缓解风湿",
    Psychological_Dimension: "正位是精神防御；逆位是愤怒、自我厌恶和评判",
    Spiritual_Dimension: "天使智慧的保护，建立能量屏障",
    Image_URL: "http://placeholder.url/4.jpg"
  },
  {
    ID: "5",
    Name: "蓝莲花 (Blue Lotus)",
    Latin_Name: "Nymphaea caerulea",
    Category: "太阳草药卡",
    Planetary_Group_Archetype: "【太阳：生命力与意识中心】关于自我的核心、光芒与纯粹的生命意志。象征\"我即存在\"。",
    Archetype: "太阳/月亮",
    Upright_Keywords: "直觉的认知、挖掘潜意识、与神秘的守护者相遇、梦境工作、启蒙",
    Reversed_Keywords: "被压抑的直觉、不信任、脱节、情绪低落、缺乏灵感、隐藏的意图、心理力量的阻塞",
    Properties: "兼具欣快感与抗痉挛放松特性",
    Physical_Dimension: "缓解组织压力，提升感官认知",
    Psychological_Dimension: "正位代表挖掘潜意识；逆位则是心理力量受阻或不信任",
    Spiritual_Dimension: "启蒙之门，在梦境与觉醒中架桥",
    Image_URL: "http://placeholder.url/5.jpg"
  },
  {
    ID: "6",
    Name: "鼠尾草 (Sage)",
    Latin_Name: "Salvia apiana",
    Category: "月亮草药卡",
    Planetary_Group_Archetype: "【月亮：潜意识与情绪滋养】关于灵魂的根基、本能的反应与直觉。象征\"我感受\"。",
    Archetype: "月亮/木星",
    Upright_Keywords: "祝福、净化、祈愿、神圣的礼物、灵性清洁、重组情感体、神秘的洞察力",
    Reversed_Keywords: "无法接受、情感自恋、逃避、否定、自我分裂、缺乏意志力、不快乐",
    Properties: "净化电磁场，调理消化腺分泌",
    Physical_Dimension: "支持淋巴净化，调节体液平衡",
    Psychological_Dimension: "正位重组情感体；逆位表现为逃避、否定或不快乐",
    Spiritual_Dimension: "灵性清洁与神圣祝福，开启神秘洞察",
    Image_URL: "http://placeholder.url/6.jpg"
  },
  {
    ID: "7",
    Name: "紫葳木 (Lapacho)",
    Latin_Name: "Tabebuia impetiginosa",
    Category: "月亮草药卡",
    Planetary_Group_Archetype: "【月亮：潜意识与情绪滋养】关于灵魂的根基、本能的反应与直觉。象征\"我感受\"。",
    Archetype: "月亮/冥王星",
    Upright_Keywords: "在黑暗中发现真相、超越已知、挖掘恐惧、打破循规蹈矩、终结循环",
    Reversed_Keywords: "无知、墨守成规、惧怕失败、抗拒成长、停滞不前、受限信念",
    Properties: "深度细胞净化，调理真菌感染及贫血",
    Physical_Dimension: "调理消化失衡，支持女性生殖健康",
    Psychological_Dimension: "正位打破循规蹈矩；逆位是惧怕失败和受限信念",
    Spiritual_Dimension: "经历暗黑女神的蜕变，从毁灭中重构",
    Image_URL: "http://placeholder.url/7.jpg"
  },
  {
    ID: "8",
    Name: "博宾萨纳 (Bobinsana)",
    Latin_Name: "Callandrinia angustifolia",
    Category: "月亮草药卡",
    Planetary_Group_Archetype: "【月亮：潜意识与情绪滋养】关于灵魂的根基、本能的反应与直觉。象征\"我感受\"。",
    Archetype: "月亮/海王星",
    Upright_Keywords: "自爱、接纳、感知、自信、同情",
    Reversed_Keywords: "分离、悲伤、失落、缺乏自我价值、孤独、缺乏爱",
    Properties: "渗透性修复，滋养情感创伤",
    Physical_Dimension: "缓解生理劳损，放松身心",
    Psychological_Dimension: "正位建立接纳与自爱；逆位则是孤独、悲伤与自我价值感缺失",
    Spiritual_Dimension: "唤醒创造性的女性精神，回归神圣信任",
    Image_URL: "http://placeholder.url/8.jpg"
  },
  {
    ID: "9",
    Name: "洋甘菊 (Chamomile)",
    Latin_Name: "Matricaria chamomilla",
    Category: "月亮草药卡",
    Planetary_Group_Archetype: "【月亮：潜意识与情绪滋养】关于灵魂的根基、本能的反应与直觉。象征\"我感受\"。",
    Archetype: "月亮/太阳",
    Upright_Keywords: "平静、恢复、柔软、纯洁、优雅、力量、内心的平和、喜悦、和谐",
    Reversed_Keywords: "不和谐、情绪困扰、过度担忧、疲惫、焦虑",
    Properties: "释放太阳神经丛与胃部的压力",
    Physical_Dimension: "缓解焦虑、失眠及消化不良",
    Psychological_Dimension: "正位为内心平和；逆位则是过度担忧、疲惫与焦虑",
    Spiritual_Dimension: "温柔疗愈，通过平静感受内在光明",
    Image_URL: "http://placeholder.url/9.jpg"
  },
  {
    ID: "10",
    Name: "艾草 (Mugwort)",
    Latin_Name: "Artemisia vulgaris",
    Category: "月亮草药卡",
    Planetary_Group_Archetype: "【月亮：潜意识与情绪滋养】关于灵魂的根基、本能的反应与直觉。象征\"我感受\"。",
    Archetype: "月亮/海王星",
    Upright_Keywords: "梦境工作、边界空间、过渡期、其他现实、洞察力、预见能力",
    Reversed_Keywords: "困于中间地带、欺骗、幻觉、迷失于迷宫、迷惑、困惑",
    Properties: "苦味补品，调理肠胃动力及月经",
    Physical_Dimension: "清除肠道寄生能量，改善消化",
    Psychological_Dimension: "正位为边界空间的洞察；逆位则表现为幻觉、分离与困惑",
    Spiritual_Dimension: "梦境工作的盟友，引导灵魂穿越地下森林",
    Image_URL: "http://placeholder.url/10.jpg"
  },
  {
    ID: "11",
    Name: "达米阿那 (Damiana)",
    Latin_Name: "Turnera diffusa",
    Category: "金星草药卡",
    Planetary_Group_Archetype: "【金星：爱与价值】关于吸引力、和谐、关系与审美。象征\"我爱\"。",
    Archetype: "金星/冥王星",
    Upright_Keywords: "吸引力、磁性、亲密关系、灵魂伴侣、关系、亲密感、神圣的游戏、在内心找到挚爱",
    Reversed_Keywords: "欲望、缺乏爱、感到不被爱、无法满足、投射出不可接近、不感兴趣、僵化",
    Properties: "恢复性补品，增强生殖活力",
    Physical_Dimension: "调理荷尔蒙失调及焦虑疲劳",
    Psychological_Dimension: "正位重塑磁性与亲密；逆位则是僵化、感到不被爱",
    Spiritual_Dimension: "在内心整合对立两极，达成神圣游戏",
    Image_URL: "http://placeholder.url/11.jpg"
  },
  {
    ID: "12",
    Name: "玫瑰 (Rose)",
    Latin_Name: "Rosa spp.",
    Category: "金星草药卡",
    Planetary_Group_Archetype: "【金星：爱与价值】关于吸引力、和谐、关系与审美。象征\"我爱\"。",
    Archetype: "金星/月亮",
    Upright_Keywords: "结合、幸福、无条件的爱，与\"他者\"融合、合一、滋养、纯净",
    Reversed_Keywords: "有条件的爱、隐秘、分离、与神圣断联",
    Properties: "平衡情绪过热导致的生理炎症",
    Physical_Dimension: "舒缓心血管压力，改善皮肤",
    Psychological_Dimension: "正位体验无条件的爱；逆位则是分离感、有条件的爱",
    Spiritual_Dimension: "与神圣女性能量融合，实现灵性结合",
    Image_URL: "http://placeholder.url/12.jpg"
  },
  {
    ID: "13",
    Name: "益母草 (Motherwort)",
    Latin_Name: "Leonurus cardiaca",
    Category: "金星草药卡",
    Planetary_Group_Archetype: "【金星：爱与价值】关于吸引力、和谐、关系与审美。象征\"我爱\"。",
    Archetype: "金星",
    Upright_Keywords: "力量、创造的本质、与内在创造者的连接、生育力、诞生、创造力、内心的信任",
    Reversed_Keywords: "虚弱、感到耗尽、封闭的心、失望、与创造的断联、缺乏创造力",
    Properties: "调理心脏与子宫，缓解心悸",
    Physical_Dimension: "缓解经期绞痛及神经性焦虑",
    Psychological_Dimension: "正位建立内在信任；逆位表现为封闭的心、耗尽感",
    Spiritual_Dimension: "唤醒内在创造者力量，保护母亲原型",
    Image_URL: "http://placeholder.url/13.jpg"
  },
  {
    ID: "14",
    Name: "木槿 (Hibiscus)",
    Latin_Name: "Hibiscus sabdariffa",
    Category: "金星草药卡",
    Planetary_Group_Archetype: "【金星：爱与价值】关于吸引力、和谐、关系与审美。象征\"我爱\"。",
    Archetype: "金星/冥王星",
    Upright_Keywords: "甘露、优雅、感官享受、美丽、神圣的女性能量、滋养、创造力、丰盛",
    Reversed_Keywords: "悲伤、不安全感、不快乐、不值得感、缺乏乐趣、自我怀疑",
    Properties: "溶解盆腔区域能量阻塞",
    Physical_Dimension: "支持肾脏排毒，调节循环",
    Psychological_Dimension: "正位提升美感享受；逆位则是自卑、自我怀疑",
    Spiritual_Dimension: "神圣女性本质的显化，在丰盛中体会喜悦",
    Image_URL: "http://placeholder.url/14.jpg"
  },
  {
    ID: "15",
    Name: "西洋蓍草 (Yarrow)",
    Latin_Name: "Achillea millefolium",
    Category: "金星草药卡",
    Planetary_Group_Archetype: "【金星：爱与价值】关于吸引力、和谐、关系与审美。象征\"我爱\"。",
    Archetype: "金星",
    Upright_Keywords: "平衡、和谐、洞察力、滋养、提升心理屏障、占卜共情、敏感界限",
    Reversed_Keywords: "失衡、情绪耗尽、缺乏界限、过度敏感、自我批评、接近倦怠",
    Properties: "止血抗炎，平衡体液",
    Physical_Dimension: "促进伤口修复，调节血液循环",
    Psychological_Dimension: "正位建立健康界限；逆位表现为过度敏感、接近倦怠",
    Spiritual_Dimension: "提升心理屏障，作为沟通神圣智慧的媒介",
    Image_URL: "http://placeholder.url/15.jpg"
  },
  {
    ID: "16",
    Name: "刺毛黧豆 (Mucuna)",
    Latin_Name: "Mucuna pruriens",
    Category: "水星草药卡",
    Planetary_Group_Archetype: "【水星：心智与沟通】关于信息的流动、思维的逻辑与表达。象征\"我思考\"。",
    Archetype: "水星、天王星",
    Upright_Keywords: "过渡状态，离开熟悉的事物，迈向未知，连接更高的意识，信任更高的智慧",
    Reversed_Keywords: "寻求安慰，对未知缺乏信任，抗拒改变，缺乏自发性",
    Properties: "提供左旋多巴，激活多巴胺通路",
    Physical_Dimension: "滋养神经系统，支持帕金森病修复",
    Psychological_Dimension: "正位勇于迈向未知；逆位则是追求安慰、抗拒改变",
    Spiritual_Dimension: "激活松果体，迈向更高维度的意识",
    Image_URL: "http://placeholder.url/16.jpg"
  },
  {
    ID: "17",
    Name: "积雪草 (Gotu Kola)",
    Latin_Name: "Centella asiatica",
    Category: "水星草药卡",
    Planetary_Group_Archetype: "【水星：心智与沟通】关于信息的流动、思维的逻辑与表达。象征\"我思考\"。",
    Archetype: "水星、月亮",
    Upright_Keywords: "隐士、独处、灵魂探索、觉悟、更深的认知、启蒙",
    Reversed_Keywords: "孤独、不确定、疏离、隔绝、困惑、怀疑",
    Properties: "改善大脑微循环，平衡左右脑",
    Physical_Dimension: "修复受损神经，提升专注力",
    Psychological_Dimension: "正位代表深度内省；逆位则是孤独、不确定与怀疑",
    Spiritual_Dimension: "隐士原型，通过独处实现觉悟",
    Image_URL: "http://placeholder.url/17.jpg"
  },
  {
    ID: "18",
    Name: "狮鬃菌 (Lion's Mane)",
    Latin_Name: "Hericium erinaceus",
    Category: "水星草药卡",
    Planetary_Group_Archetype: "【水星：心智与沟通】关于信息的流动、思维的逻辑与表达。象征\"我思考\"。",
    Archetype: "水星、天王星",
    Upright_Keywords: "神圣的阳性能量、领导力、雄心、给予者、强大的意志力、精神力量",
    Reversed_Keywords: "自负、虚荣、自私、缺乏意图、强硬、冷漠",
    Properties: "刺激神经生长因子（NGF），重塑网络",
    Physical_Dimension: "增强记忆，缓解认知障碍",
    Psychological_Dimension: "正位建立雄心与意志；逆位则是自负、冷漠、无意图",
    Spiritual_Dimension: "引导神圣阳性能量，实现意志与感知的统一",
    Image_URL: "http://placeholder.url/18.jpg"
  },
  {
    ID: "19",
    Name: "圣罗勒 (Holy Basil)",
    Latin_Name: "Ocimum sanctum",
    Category: "水星草药卡",
    Planetary_Group_Archetype: "【水星：心智与沟通】关于信息的流动、思维的逻辑与表达。象征\"我思考\"。",
    Archetype: "水星/木星",
    Upright_Keywords: "真正的财富、繁荣、魅力、活力、奢华、美好、吉祥",
    Reversed_Keywords: "天真、虚荣、无知、空虚、不成熟、对物质世界的执迷",
    Properties: "适应原草药，调节压力荷尔蒙",
    Physical_Dimension: "支持肾上腺，缓解焦虑疲劳",
    Psychological_Dimension: "正位获得吉祥繁荣；逆位表现为虚荣、对物质执迷",
    Spiritual_Dimension: "财富女神拉克希米的化身，连接天堂与大地",
    Image_URL: "http://placeholder.url/19.jpg"
  },
  {
    ID: "20",
    Name: "薰衣草 (Lavender)",
    Latin_Name: "Lavandula officinalis",
    Category: "水星草药卡",
    Planetary_Group_Archetype: "【水星：心智与沟通】关于信息的流动、思维的逻辑与表达。象征\"我思考\"。",
    Archetype: "水星",
    Upright_Keywords: "潜潜力编织者、新的开始、直觉智慧、沉思阶段、情感满足、步入和谐",
    Reversed_Keywords: "不安的灵魂、无法看到可能性、匮乏心态、不信任、过度批评",
    Properties: "神经镇静剂，舒缓过度兴奋",
    Physical_Dimension: "改善睡眠，清除脑雾",
    Psychological_Dimension: "正位步入和谐；逆位表现为不安的灵魂、过度批评",
    Spiritual_Dimension: "潜力的编织者，将灵感转化为现实结构",
    Image_URL: "http://placeholder.url/20.jpg"
  },
  {
    ID: "21",
    Name: "荨麻 (Nettle)",
    Latin_Name: "Urtica dioica",
    Category: "火星草药卡",
    Planetary_Group_Archetype: "【火星：意志与行动】关于生存欲望、勇气、决断力与防御。象征\"我做\"。",
    Archetype: "火星/冥王星",
    Upright_Keywords: "直接行动、强大的保护者、领导力、力量、权力、追求真理",
    Reversed_Keywords: "急躁、易怒、挫败感、过度控制、鲁莽、冒失",
    Properties: "调节炎症反应/补充铁质",
    Physical_Dimension: "缓解关节炎、过敏及贫血",
    Psychological_Dimension: "转化压抑的愤怒、点燃领导力",
    Spiritual_Dimension: "赋予转化火焰、勇敢追求最高真理",
    Image_URL: "http://placeholder.url/21.jpg"
  },
  {
    ID: "22",
    Name: "蛇根草 (Jergon Sacha)",
    Latin_Name: "Dracontium loretense",
    Category: "火星草药卡",
    Planetary_Group_Archetype: "【火星：意志与行动】关于生存欲望、勇气、决断力与防御。象征\"我做\"。",
    Archetype: "火星/冥王星",
    Upright_Keywords: "意外的变化、崩溃、转化、毒素被转化、邪恶被中和、从灰烬中重生",
    Reversed_Keywords: "危机、毁灭、黑魔法、恶意意图、巫术、毒素、被迫谦卑",
    Properties: "强力解毒/抗病毒",
    Physical_Dimension: "中和血液毒素、调理月经与呼吸道",
    Psychological_Dimension: "应对突发崩溃、在危机中实现重生",
    Spiritual_Dimension: "中和恶意意图、将黑暗能量炼化为良药",
    Image_URL: "http://placeholder.url/22.jpg"
  },
  {
    ID: "23",
    Name: "乳蓟 (Milk Thistle)",
    Latin_Name: "Silybum marianum",
    Category: "火星草药卡",
    Planetary_Group_Archetype: "【火星：意志与行动】关于生存欲望、勇气、决断力与防御。象征\"我做\"。",
    Archetype: "火星/月亮",
    Upright_Keywords: "和平战士、盾牌、庇护所、避难所、安全守护、公正",
    Reversed_Keywords: "攻击性、严厉、冲动、竞争、自我破坏、过度行为、八卦",
    Properties: "保护并修复热性导致的肝损伤",
    Physical_Dimension: "支持胆囊功能、支持体液过滤",
    Psychological_Dimension: "克服自我破坏与攻击性、设立公正界限",
    Spiritual_Dimension: "和平战士原型、在动荡中保持安定",
    Image_URL: "http://placeholder.url/23.jpg"
  },
  {
    ID: "24",
    Name: "烟草 (Tobacco)",
    Latin_Name: "Nicotiana tabacum, Nicotiana rusticum",
    Category: "火星草药卡",
    Planetary_Group_Archetype: "【火星：意志与行动】关于生存欲望、勇气、决断力与防御。象征\"我做\"。",
    Archetype: "火星/冥王星",
    Upright_Keywords: "力量、奉献（ofrenda）、神圣的礼物、祈求、尊重，与意志和目标深度对齐",
    Reversed_Keywords: "力量的幻象、渴求权力、缺乏尊重、内在冲突、成瘾、陷入习惯、对失败的恐惧",
    Properties: "强效排泄药/调节肺部",
    Physical_Dimension: "排除深层淤积、治疗发烧与皮肤病",
    Psychological_Dimension: "纠正权力的幻象、寻找内在的尊重",
    Spiritual_Dimension: "终极奉献物、连接灵界的导师植物",
    Image_URL: "http://placeholder.url/24.jpg"
  },
  {
    ID: "25",
    Name: "猫爪草 (Cat's Claw)",
    Latin_Name: "Uncaria tomentosa",
    Category: "火星草药卡",
    Planetary_Group_Archetype: "【火星：意志与行动】关于生存欲望、勇气、决断力与防御。象征\"我做\"。",
    Archetype: "火星/冥王星",
    Upright_Keywords: "重写故事，连接归属感、自我价值、安全感，连接你的根源，DNA净化",
    Reversed_Keywords: "感到被排斥，与根源断联，创伤、羞耻、遗憾、拒绝、孤独",
    Properties: "极强免疫刺激剂/修复受损DNA",
    Physical_Dimension: "处理慢性炎症、哮喘及环境毒素",
    Psychological_Dimension: "疗愈被排斥感、重写个人生命故事",
    Spiritual_Dimension: "唤醒祖先智慧、实现自我价值的回归",
    Image_URL: "http://placeholder.url/25.jpg"
  },
  {
    ID: "26",
    Name: "虫草 (Cordyceps)",
    Latin_Name: "Cordyceps sinensis, Cordyceps militaris",
    Category: "木星草药卡",
    Planetary_Group_Archetype: "【木星：扩张与信仰】关于更高维度的智慧、好运与信仰。象征\"我理解\"。",
    Archetype: "木星/冥王星/火星",
    Upright_Keywords: "能量、更新、翱翔新高度的机会、激活、复活",
    Reversed_Keywords: "重新连接精神、抗拒死亡、遗忘你的力量、虚弱",
    Properties: "增强耐力/提高肺活量与肾脏动力",
    Physical_Dimension: "修复疲劳、虚弱、提升身体能量",
    Psychological_Dimension: "激发雄心、打破自我局限",
    Spiritual_Dimension: "像鹰一样翱翔、连接以太领域并超越物质局限",
    Image_URL: "http://placeholder.url/26.jpg"
  },
  {
    ID: "27",
    Name: "灵芝 (Reishi)",
    Latin_Name: "Ganoderma lucidum, Ganoderma applanatum",
    Category: "木星草药卡",
    Planetary_Group_Archetype: "【木星：扩张与信仰】关于更高维度的智慧、好运与信仰。象征\"我理解\"。",
    Archetype: "木星/太阳",
    Upright_Keywords: "静修、恢复、冥想、冬眠、精神沉思、补充灵性力量",
    Reversed_Keywords: "沉默、恢复、暂停时间、过度刺激、压力、衰退、接近倦怠",
    Properties: "平衡免疫/调控神经内分泌轴",
    Physical_Dimension: "延缓衰老、平静心灵、辅助深度睡眠",
    Psychological_Dimension: "平息内心喧嚣、缓解过度刺激的压力",
    Spiritual_Dimension: "神补品、在深度冥想中实现灵性冬眠",
    Image_URL: "http://placeholder.url/27.jpg"
  },
  {
    ID: "28",
    Name: "接骨木 (Elderberry)",
    Latin_Name: "Sambucus nigra, Sambucus canadensis",
    Category: "木星草药卡",
    Planetary_Group_Archetype: "【木星：扩张与信仰】关于更高维度的智慧、好运与信仰。象征\"我理解\"。",
    Archetype: "木星/冥王星",
    Upright_Keywords: "从冥界升起、释放、放手、重大转变、更高智慧、新的感知、觉醒真相",
    Reversed_Keywords: "停滞、悲伤、抗拒转变、不道德、不吸取教训、不拓宽视野、不培养智慧、衰败、消极",
    Properties: "血液净化与抗病毒/清理淋巴系统",
    Physical_Dimension: "预防感冒、支持肾脏与消化系统",
    Psychological_Dimension: "引导个人穿越重大转变期的悲伤",
    Spiritual_Dimension: "守护冥界门户、理解通过旧自我死亡获得觉醒",
    Image_URL: "http://placeholder.url/28.jpg"
  },
  {
    ID: "29",
    Name: "五味子 (Schisandra)",
    Latin_Name: "Schisandra chinensis",
    Category: "木星草药卡",
    Planetary_Group_Archetype: "【木星：扩张与信仰】关于更高维度的智慧、好运与信仰。象征\"我理解\"。",
    Archetype: "木星/金星",
    Upright_Keywords: "内在美、灵感、欣喜、愿景、超自然力量、共鸣",
    Reversed_Keywords: "冷漠、不接地气、不平衡、需要练习、走中庸之道",
    Properties: "平衡阴阳/进入十二经络",
    Physical_Dimension: "保护肝脏、平衡荷尔蒙、延缓细胞老化",
    Psychological_Dimension: "克服冷漠、培养感官与愿景的共鸣",
    Spiritual_Dimension: "节制原型、体验优雅的炼金术与合一",
    Image_URL: "http://placeholder.url/29.jpg"
  },
  {
    ID: "30",
    Name: "紫锥花 (Echinacea)",
    Latin_Name: "Echinacea angustifolia, Echinacea purpurea, Echinacea pallida",
    Category: "木星草药卡",
    Planetary_Group_Archetype: "【木星：扩张与信仰】关于更高维度的智慧、好运与信仰。象征\"我理解\"。",
    Archetype: "木星/冥王星",
    Upright_Keywords: "命运之轮、生命循环、命运的转变、更大的愿景、幸运",
    Reversed_Keywords: "因果报应、执着于控制、不受欢迎的变化、痛苦的循环、需要改变",
    Properties: "强烈刺激免疫防御/净化血液",
    Physical_Dimension: "预防感冒及上呼吸道感染",
    Psychological_Dimension: "放弃强迫性控制、顺应生命流转",
    Spiritual_Dimension: "观察命运之轮宏大图景、洞察业力真相",
    Image_URL: "http://placeholder.url/30.jpg"
  },
  {
    ID: "31",
    Name: "大麻 (Cannabis)",
    Latin_Name: "Cannabis sativa",
    Category: "土星草药卡",
    Planetary_Group_Archetype: "【土星：业力与结构】关于时间的考验、边界、责任以及稳固的根基。象征\"我承担\"。",
    Archetype: "土星/海王星",
    Upright_Keywords: "超脱、深度沉思、从痛苦中解脱、内在平静、免疫力",
    Reversed_Keywords: "麻木、分离、忽视、慢性疼痛、看不到出路、困住、不安",
    Properties: "肌肉骨骼松弛剂/对抗僵硬与疼痛",
    Physical_Dimension: "缓解慢性炎症、痛风及失眠",
    Psychological_Dimension: "从长期精神压抑中解脱、获得超脱感",
    Spiritual_Dimension: "体验时空之外的宁静、进入深度沉思",
    Image_URL: "http://placeholder.url/31.jpg"
  },
  {
    ID: "32",
    Name: "康复力 (Comfrey)",
    Latin_Name: "Symphytum officinale",
    Category: "土星草药卡",
    Planetary_Group_Archetype: "【土星：业力与结构】关于时间的考验、边界、责任以及稳固的根基。象征\"我承担\"。",
    Archetype: "土星",
    Upright_Keywords: "成就、循环的完成、成功、结束长途旅园程、完整性、修复",
    Reversed_Keywords: "重蹈覆辙，缺乏关闭感、不完整、空虚",
    Properties: "接骨草/修复结构",
    Physical_Dimension: "修复骨折、软组织损伤及皮肤创伤",
    Psychological_Dimension: "追求完整、结束拖延的生命循环",
    Spiritual_Dimension: "在周期终点发现整体感、修复灵魂裂缝",
    Image_URL: "http://placeholder.url/32.jpg"
  },
  {
    ID: "33",
    Name: "山金车 (Arnica)",
    Latin_Name: "Arnica montana, Arnica cardifolia",
    Category: "土星草药卡",
    Planetary_Group_Archetype: "【土星：业力与结构】关于时间的考验、边界、责任以及稳固的根基。象征\"我承担\"。",
    Archetype: "土星",
    Upright_Keywords: "忠诚、承诺、坚持、稳定、陪伴、社区、导师",
    Reversed_Keywords: "个人主义、寻找自己的道路、孤狼、过度独立、回避冲突",
    Properties: "增加受损区域血流/促进组织再生",
    Physical_Dimension: "外用治疗瘀伤、挫伤及血肿",
    Psychological_Dimension: "在创伤后重建稳定、建立团队忠诚",
    Spiritual_Dimension: "狼灵原型、作为坚韧导师引领他人穿越黑暗",
    Image_URL: "http://placeholder.url/33.jpg"
  },
  {
    ID: "34",
    Name: "卡痛叶 (Kratom)",
    Latin_Name: "Mitragynia speciosa",
    Category: "土星草药卡",
    Planetary_Group_Archetype: "【土星：业力与结构】关于时间的考验、边界、责任以及稳固的根基。象征\"我承担\"。",
    Archetype: "土星/海王星",
    Upright_Keywords: "潜意识疗愈、内外世界的同步、变形、时间旅行、超越幻象",
    Reversed_Keywords: "强迫性思维、虚幻的表象、成瘾、自我放弃、无法成长、停滞",
    Properties: "深度放松躯体结构/阻断痛觉通路",
    Physical_Dimension: "缓解压力、疼痛及疲劳、辅助戒断成瘾",
    Psychological_Dimension: "处理强迫性思维、通过变形打破习惯",
    Spiritual_Dimension: "穿越现实幻象、揭示潜意识中的真相",
    Image_URL: "http://placeholder.url/34.jpg"
  },
  {
    ID: "35",
    Name: "木贼草 (Horsetail)",
    Latin_Name: "Equisetum arvense",
    Category: "土星草药卡",
    Planetary_Group_Archetype: "【土星：业力与结构】关于时间的考验、边界、责任以及稳固的根基。象征\"我承担\"。",
    Archetype: "土星/金星",
    Upright_Keywords: "耐力、专注、孕育期、信任过程、敏感度提升",
    Reversed_Keywords: "挑战、固执、困境、失落感、不耐烦",
    Properties: "强化骨密度及结缔组织",
    Physical_Dimension: "修复骨裂、指甲及头发、支持肾脏",
    Psychological_Dimension: "培养耐力与耐心、对抗不耐烦",
    Spiritual_Dimension: "信任漫长孕育期、在挑战中获得灵性敏感度",
    Image_URL: "http://placeholder.url/35.jpg"
  },
  {
    ID: "36",
    Name: "古柯叶 (Coca)",
    Latin_Name: "Erythroxylum coca",
    Category: "天王星草药卡",
    Planetary_Group_Archetype: "【天王星：觉醒与变革】关于突发的变化、独立、打破陈规与高频能量。象征\"我创新\"。",
    Archetype: "天王星/金星",
    Upright_Keywords: "超自然力量、洞察普遍真理的能力、天赋、灵性指引、才华、无可挑剔的正直",
    Reversed_Keywords: "不信任、与源头断开、拒绝天赋、自我中心、妄自尊大",
    Properties: "激发耐力与神经活性",
    Physical_Dimension: "提升耐力、调理高海拔不适及体力透支",
    Psychological_Dimension: "激活天才特质与正直感、拒绝平庸",
    Spiritual_Dimension: "美洲虎之药、作为跨越门户的灵界使者",
    Image_URL: "http://placeholder.url/36.jpg"
  },
  {
    ID: "37",
    Name: "红景天 (Rhodiola)",
    Latin_Name: "Rhodiola rosea",
    Category: "天王星草药卡",
    Planetary_Group_Archetype: "【天王星：觉醒与变革】关于突发的变化、独立、打破陈规与高频能量。象征\"我创新\"。",
    Archetype: "天王星/水星",
    Upright_Keywords: "魔法、智慧的守护者、纯净、高层次意识、清晰、直觉智慧、魅力",
    Reversed_Keywords: "过度分析、缺乏魅力、无法表达思想、情感阻塞、自我中心",
    Properties: "高原人参/提高极端环境耐受力",
    Physical_Dimension: "缓解疲劳、提高性欲与生育能力",
    Psychological_Dimension: "保持冷静决断力、扫除思维迷雾",
    Spiritual_Dimension: "独角兽原型、守护智慧纯净并感应真理",
    Image_URL: "http://placeholder.url/37.jpg"
  },
  {
    ID: "38",
    Name: "可可 (Cacao)",
    Latin_Name: "Theobroma cacao",
    Category: "天王星草药卡",
    Planetary_Group_Archetype: "【天王星：觉醒与变革】关于突发的变化、独立、打破陈规与高频能量。象征\"我创新\"。",
    Archetype: "天王星/金星",
    Upright_Keywords: "启蒙、灵性考验、启示、通往宇宙之心的通道、神圣之爱、光之存有、接触光之语言",
    Reversed_Keywords: "破碎的翅膀、自我怀疑、缺乏自爱、阻碍自己的道路",
    Properties: "调节神经递质/支持大脑供能",
    Physical_Dimension: "缓解疲劳、心悸及精神虚弱",
    Psychological_Dimension: "打开心扉、释放被误导的创造性能量",
    Spiritual_Dimension: "接触光之语言、在神圣之爱中完成灵魂启蒙",
    Image_URL: "http://placeholder.url/38.jpg"
  },
  {
    ID: "39",
    Name: "银杏 (Ginkgo)",
    Latin_Name: "Ginkgo biloba",
    Category: "天王星草药卡",
    Planetary_Group_Archetype: "【天王星：觉醒与变革】关于突发的变化、独立、打破陈规与高频能量。象征\"我创新\"。",
    Archetype: "火星/天王星",
    Upright_Keywords: "新思想的黎明、新点子、远见思维、心智清晰、韧性",
    Reversed_Keywords: "过度思考、判断模糊、精神绝望、被集体的黑暗压垮",
    Properties: "优化脑部电力传导/提高心智韧性",
    Physical_Dimension: "改善大脑微循环、调理心血管与呼吸",
    Psychological_Dimension: "通过远见打破绝望、点燃新思想黎明",
    Spiritual_Dimension: "意识革命性转变、用真理之剑斩断幻象",
    Image_URL: "http://placeholder.url/39.jpg"
  },
  {
    ID: "40",
    Name: "人参 (Ginseng)",
    Latin_Name: "Panax ginseng, Panax quinquefolius",
    Category: "天王星草药卡",
    Planetary_Group_Archetype: "【天王星：觉醒与变革】关于突发的变化、独立、打破陈规与高频能量。象征\"我创新\"。",
    Archetype: "天王星/木星",
    Upright_Keywords: "卓越的创造者、无限的能量、潜力、足智多谋、扩展",
    Reversed_Keywords: "未被开发的天赋、缺乏行动、错失机会、不相信自身的内在力量",
    Properties: "滋养神经内分泌轴/补充精",
    Physical_Dimension: "极效提神、调理肾上腺疲劳",
    Psychological_Dimension: "展现无限资源感、将潜能转化为行动",
    Spiritual_Dimension: "魔术师原型、将灵魂最高意图投射到现实",
    Image_URL: "http://placeholder.url/40.jpg"
  },
  {
    ID: "41",
    Name: "罂粟 (Poppy)",
    Latin_Name: "Papaver somniferum",
    Category: "海王星草药卡",
    Planetary_Group_Archetype: "【海王星：消融与救赎】关于边界的消融、慈悲、艺术想象力与神圣体验。象征\"我合一\"。",
    Archetype: "海王星/土星",
    Upright_Keywords: "梦境的奥秘、伟大的未知、打破成瘾习惯、释放不健康的关系、对齐新的意图",
    Reversed_Keywords: "迷失于迷宫中、对现实的困惑、物质主义、成瘾、无意性、执迷、诱惑",
    Properties: "极效止痛药",
    Physical_Dimension: "诱导催眠、调理剧烈疼痛与痉挛",
    Psychological_Dimension: "面对并打破成瘾行为、释放不健康关系",
    Spiritual_Dimension: "在梦境黑暗中对齐光点、洞察未知奥秘",
    Image_URL: "http://placeholder.url/41.jpg"
  },
  {
    ID: "42",
    Name: "鹅膏菌 (Amanita)",
    Latin_Name: "Amanita muscaria",
    Category: "海王星草药卡",
    Planetary_Group_Archetype: "【海王星：消融与救赎】关于边界的消融、慈悲、艺术想象力与神圣体验。象征\"我合一\"。",
    Archetype: "海王星/冥王星/水星",
    Upright_Keywords: "通道、媒介、现实的桥梁、与更高力量的连接、庆祝、家庭、觉醒",
    Reversed_Keywords: "缺乏归属感、与源头断开、家庭疗愈、痛苦、不接地气",
    Properties: "作用于中枢神经/改变意识状态",
    Physical_Dimension: "调理神经疲劳与精神失衡",
    Psychological_Dimension: "寻求家庭根源疗愈、找回遗落归属感",
    Spiritual_Dimension: "成为接收更高指引的神圣通道",
    Image_URL: "http://placeholder.url/42.jpg"
  },
  {
    ID: "43",
    Name: "西番莲 (Passionflower)",
    Latin_Name: "Passiflora incarnata",
    Category: "海王星草药卡",
    Planetary_Group_Archetype: "【海王星：消融与救赎】关于边界的消融、慈悲、艺术想象力与神圣体验。象征\"我合一\"。",
    Archetype: "海王星/月亮",
    Upright_Keywords: "牺牲、臣服、选择成长、信任洞察力、放手的仪式",
    Reversed_Keywords: "欺骗、误导的意图、错失机会、意外中止、错误判断",
    Properties: "强效镇静与抗焦虑/修复神经",
    Physical_Dimension: "缓解心悸、痉挛及失眠",
    Psychological_Dimension: "学会神圣臣服、牺牲过时执着",
    Spiritual_Dimension: "触及基督意识、通过放手仪式实现成长",
    Image_URL: "http://placeholder.url/43.jpg"
  },
  {
    ID: "44",
    Name: "缬草 (Valerian)",
    Latin_Name: "Valeriana officinalis",
    Category: "海王星草药卡",
    Planetary_Group_Archetype: "【海王星：消融与救赎】关于边界的消融、慈悲、艺术想象力与神圣体验。象征\"我合一\"。",
    Archetype: "海王星",
    Upright_Keywords: "秩序、放松、接纳、拥抱不完美、坚持、流动",
    Reversed_Keywords: "易被触发、过于野心勃勃、自我批评、完美主义、自我评判",
    Properties: "诱导深度休息/调理长期紧张",
    Physical_Dimension: "修复睡眠质量、缓解神经性震颤",
    Psychological_Dimension: "放弃完美主义、接纳生命不完美",
    Spiritual_Dimension: "跨越清醒与梦境门槛、获得安宁智慧",
    Image_URL: "http://placeholder.url/44.jpg"
  },
  {
    ID: "45",
    Name: "曼德拉草 (Mandrake)",
    Latin_Name: "Mandragora officinarum",
    Category: "海王星草药卡",
    Planetary_Group_Archetype: "【海王星：消融与救赎】关于边界的消融、慈悲、艺术想象力与神圣体验。象征\"我合一\"。",
    Archetype: "海王星/金星",
    Upright_Keywords: "感官体验，发现新的亲密形式，找到内在的爱人，表达健康的性欲，丰盛",
    Reversed_Keywords: "感官受阻，对性羞耻，创造力被误导，欲望未被引导",
    Properties: "强力麻醉与催情药剂",
    Physical_Dimension: "调理不孕症、溃疡及深度焦虑",
    Psychological_Dimension: "克服性羞耻、引导被压抑创造力",
    Spiritual_Dimension: "将爱提升至神圣高度、通过感官体验灵魂完整",
    Image_URL: "http://placeholder.url/45.jpg"
  },
  {
    ID: "46",
    Name: "曼陀罗花 (Brugmansia)",
    Latin_Name: "Brugmansia sanguinea, Brugmansia suaveolens",
    Category: "冥王星草药卡",
    Planetary_Group_Archetype: "【冥王星：转化与重生】关于深层的转化、潜意识的阴影、权力与灵魂的炼金术。象征\"我蜕变\"。",
    Archetype: "冥王星/火星",
    Upright_Keywords: "崩溃、净化性转变、从灰烬中重生、消除、死亡、脱去旧有",
    Reversed_Keywords: "忽视召唤、精神和情感危机、幻觉、破碎、拒绝现实",
    Properties: "催化深刻灵视/灵魂旅行推力",
    Physical_Dimension: "萨满疗愈中作为剧毒与药性平衡",
    Psychological_Dimension: "直面黑暗情感、在崩溃灰烬中重建自我",
    Spiritual_Dimension: "经历仪式性死亡、脱去旧身份以重生",
    Image_URL: "http://placeholder.url/46.jpg"
  },
  {
    ID: "47",
    Name: "头骨草 (Skullcap)",
    Latin_Name: "Scutellaria lateriflora, Scutellaria baicalensis",
    Category: "冥王星草药卡",
    Planetary_Group_Archetype: "【冥王星：转化与重生】关于深层的转化、潜意识的阴影、权力与灵魂的炼金术。象征\"我蜕变\"。",
    Archetype: "冥王星/土星",
    Upright_Keywords: "风暴过后的平静，放下控制，相信生命，顺从神圣计划，打开心扉",
    Reversed_Keywords: "崩溃、恐惧、创伤后压力障碍、无法前行、破碎",
    Properties: "疗愈神经崩溃/调理严重疲劳",
    Physical_Dimension: "缓解肌肉痉挛、心脏疾病及抽搐",
    Psychological_Dimension: "克服创伤后压力障碍（PTSD）、寻找静止",
    Spiritual_Dimension: "绑定灵魂誓言、将意志顺从于神圣计划",
    Image_URL: "http://placeholder.url/47.jpg"
  },
  {
    ID: "48",
    Name: "卡瓦胡椒 (Kava Kava)",
    Latin_Name: "Piper methysticum",
    Category: "冥王星草药卡",
    Planetary_Group_Archetype: "【冥王星：转化与重生】关于深层的转化、潜意识的阴影、权力与灵魂的炼金术。象征\"我蜕变\"。",
    Archetype: "冥王星/月亮",
    Upright_Keywords: "庆祝，与部落的亲密关系，社区，友谊，团结，找到你选择的家庭",
    Reversed_Keywords: "分离，严肃，不愿与他人建立联系，孤独",
    Properties: "放松骨骼肌/提升心智流动性",
    Physical_Dimension: "缓解抑郁、困惑及由于压力导致的身体僵硬",
    Psychological_Dimension: "打破孤独、建立与部落社区团结",
    Spiritual_Dimension: "经历灵魂柔化、在蝴蝶般蜕变中重生",
    Image_URL: "http://placeholder.url/48.jpg"
  },
  {
    ID: "49",
    Name: "裸盖菇 (Psilocybe)",
    Latin_Name: "Psilocybe cubensis, Psilocybe cyanescens, Psilocybe mexicana",
    Category: "冥王星草药卡",
    Planetary_Group_Archetype: "【冥王星：转化与重生】关于深层的转化、潜意识的阴影、权力与灵魂的炼金术。象征\"我蜕变\"。",
    Archetype: "冥王星/太阳",
    Upright_Keywords: "与神圣共融，与超凡能量连接，通过联合实现远程观视，重生，与部落团结，找到宇宙家庭",
    Reversed_Keywords: "断联，缺乏社区感，害怕与他人融合，对连接缺乏兴趣，灵魂失落，过去的痛苦",
    Properties: "激活血清素受体/改善抑郁",
    Physical_Dimension: "改善生活质量、重置神经通路频率",
    Psychological_Dimension: "消除隔离感、在共融中重建自我边界",
    Spiritual_Dimension: "与神圣孩子沟通、接收唤醒智慧的光之密码",
    Image_URL: "http://placeholder.url/49.jpg"
  },
  {
    ID: "50",
    Name: "死藤水 (Ayahuasca)",
    Latin_Name: "Banisteriopsis caapi, Psychotria viridis",
    Category: "冥王星草药卡",
    Planetary_Group_Archetype: "【冥王星：转化与重生】关于深层的转化、潜意识的阴影、权力与灵魂的炼金术。象征\"我蜕变\"。",
    Archetype: "冥王星/木星/海王星",
    Upright_Keywords: "重生、掌握、伟大的启示、发现更高自我、与创造者相遇、神圣使者的礼物、灵性实现、心灵感应、超越",
    Reversed_Keywords: "不相信无形的力量、失去身份、抗拒改变、困于旧模式、无法超越经验、理想和欲望的破碎",
    Properties: "彻底细胞与精神净化",
    Physical_Dimension: "清除体内毒素、重置免疫与神经系统",
    Psychological_Dimension: "经历灵魂宣泄、揭示未被发现的自我领地",
    Spiritual_Dimension: "终极超越、在神圣使者引导下实现灵性实现",
    Image_URL: "http://placeholder.url/50.jpg"
  },
  {
    ID: "51",
    Name: "龙血树 (Dragon's Blood)",
    Latin_Name: "Dracaena draco",
    Category: "小行星草药卡",
    Planetary_Group_Archetype: "【高阶能量：阴影与独立】代表潜意识中被压抑的愤怒、欲望以及不妥协的独立精神。",
    Archetype: "黑月莉莉丝/冥王星",
    Upright_Keywords: "合一、神秘知识、启蒙",
    Reversed_Keywords: "压倒性的情绪冲突、灵性视野受阻、内在混乱",
    Properties: "卓越的止血与密封伤口能力；内服用于处理胃酸过多、溃疡、结肠炎及预防内脏出血；具有显著的抗病毒作用",
    Physical_Dimension: "卓越的止血与密封伤口能力；内服用于处理胃酸过多、溃疡、结肠炎及预防内脏出血；具有显著的抗病毒作用",
    Psychological_Dimension: "正位：掌握神秘知识，拥有内在权威，实现心理韧性的重建。逆位：压倒性的情绪冲突，灵性视野受阻导致的内在混乱。",
    Spiritual_Dimension: "进入世界之魂（Anima Mundi）的虚空，在黑暗的寂静中发现自我存在的独特模式，并与原始神圣能量融合。",
    Image_URL: "http://placeholder.url/51.jpg"
  },
  {
    ID: "52",
    Name: "柠檬香蜂草 (Lemon Balm)",
    Latin_Name: "Melissa officinalis",
    Category: "小行星草药卡",
    Planetary_Group_Archetype: "【高阶能量：滋养与哀悼】代表我们如何给予和接受滋养，以及面对丧失时的复原力。",
    Archetype: "谷神星/木星",
    Upright_Keywords: "情感平衡、滋养",
    Reversed_Keywords: "与源头断联、内在小孩受损、自我滋养能力匮乏",
    Properties: "显著缓解心理压力引起的主体不适，平息中枢神经系统，减轻焦虑与抑郁；通过平衡情感波动恢复内稳态",
    Physical_Dimension: "显著缓解心理压力引起的主体不适，平息中枢神经系统，减轻焦虑与抑郁；通过平衡情感波动恢复内稳态",
    Psychological_Dimension: "正位：与大地母亲建立深层链接，获得情感上的安全感。逆位：与源头断联，内在小孩受损，表现为自我滋养能力匮乏。",
    Spiritual_Dimension: "重获花蜜魔法，通过学习变得柔软与接受，在滋养的力量中走向灵魂的完整。",
    Image_URL: "http://placeholder.url/52.jpg"
  },
  {
    ID: "53",
    Name: "蒲公英 (Dandelion)",
    Latin_Name: "Taraxacum officinale",
    Category: "小行星草药卡",
    Planetary_Group_Archetype: "【高阶能量：医者与伤口】代表灵魂中那道无法完全愈合的伤口，但这正是你天赋的来源。",
    Archetype: "凯龙星/木星",
    Upright_Keywords: "疗愈之旅、活力恢复",
    Reversed_Keywords: "受害者心态、因创伤导致的生命停滞、本能欲望被拒绝",
    Properties: "作为万能药支持肝脏与胆囊排毒，逐渐恢复生命活力；强力支持血液净化，帮助身体在毒性环境中实现自我更新",
    Physical_Dimension: "作为万能药支持肝脏与胆囊排毒，逐渐恢复生命活力；强力支持血液净化，帮助身体在毒性环境中实现自我更新",
    Psychological_Dimension: "正位：体现受伤的疗愈者身份，将伤痛转化为觉醒工具。逆位：受害者心态，因创伤导致的生命停滞，或本能欲望被拒绝。",
    Spiritual_Dimension: "用过去的伤痛定义神圣目标，在通往不朽的旅程中寻找并传递个人的医疗天赋。",
    Image_URL: "http://placeholder.url/53.jpg"
  },
  {
    ID: "54",
    Name: "睡茄 (Ashwagandha)",
    Latin_Name: "Withania somnifera",
    Category: "月亮交点草药卡",
    Planetary_Group_Archetype: "【交点能量：使命与进阶】代表灵魂进化的方向（北交点）与未来的自我。",
    Archetype: "北交点/月亮",
    Upright_Keywords: "法则(Dharma)、未来自我",
    Reversed_Keywords: "精疲力竭、目标迷失、受过去业力伤害的束缚",
    Properties: "极效适应原，提升免疫耐受力，赋予如马的力量；促进深度睡眠（Soma特质）以补充精气，调节应激反应",
    Physical_Dimension: "极效适应原，提升免疫耐受力，赋予如马的力量；促进深度睡眠（Soma特质）以补充精气，调节应激反应",
    Psychological_Dimension: "正位：发现未来的自我，明确人生方向与目标。逆位：精疲力竭、目标迷失，或受过去业力伤害的束缚。",
    Spiritual_Dimension: "实现神圣的法则（Dharma），在内在意图与外在现实之间建立无缝的连贯表达。",
    Image_URL: "http://placeholder.url/54.jpg"
  },
  {
    ID: "55",
    Name: "圣木 (Palo Santo)",
    Latin_Name: "Bursera graveolens",
    Category: "月亮交点草药卡",
    Planetary_Group_Archetype: "【交点能量：天赋与业力】代表前世的天赋（南交点）与需要释放的业力遗留。",
    Archetype: "南交点/冥王星",
    Upright_Keywords: "保护、净化",
    Reversed_Keywords: "沉溺于过去、受困于旧的业力模式、无法实现新的成长",
    Properties: "净化空间坏空气，改善呼吸道循环，缓解因能量淤积导致的关节和肌肉疼痛",
    Physical_Dimension: "净化空间坏空气，改善呼吸道循环，缓解因能量淤积导致的关节和肌肉疼痛",
    Psychological_Dimension: "正位：激活沉睡的前世天赋与直觉。逆位：沉溺于过去，受困于旧的业力模式而无法实现新的成长。",
    Spiritual_Dimension: "扮演神圣守护者与神圣诡计者，将过去的毒素转化为灵性的黄金。",
    Image_URL: "http://placeholder.url/55.jpg"
  }
];

// 根据原型推断行星
const getPlanetByArchetype = (archetype: string): string => {
  const planetMap: Record<string, string> = {
    '太阳': '太阳',
    '月亮': '月亮',
    '水星': '水星',
    '金星': '金星',
    '火星': '火星',
    '木星': '木星',
    '土星': '土星',
    '天王星': '天王星',
    '海王星': '海王星',
    '冥王星': '冥王星',
    '凯龙星': '凯龙星',
    '黑月莉莉丝': '黑月莉莉丝',
    '谷神星': '谷神星',
    '北交点': '北交点',
    '南交点': '南交点',
  };

  for (const [key, value] of Object.entries(planetMap)) {
    if (archetype.startsWith(key)) {
      return value;
    }
  }
  return '宇宙';
};

// 根据原型推断元素
const getElementByArchetype = (archetype: string): string => {
  if (archetype.includes('火星') || archetype.includes('太阳')) return '火';
  if (archetype.includes('月亮') || archetype.includes('金星') || archetype.includes('海王星')) return '水';
  if (archetype.includes('水星') || archetype.includes('天王星')) return '风';
  if (archetype.includes('土星') || archetype.includes('冥王星')) return '土';
  return '以太';
};

// 根据原型推断星座
const getZodiacByArchetype = (archetype: string): string => {
  const zodiacMap: Record<string, string> = {
    '太阳': '狮子座',
    '月亮': '巨蟹座',
    '水星': '双子座/处女座',
    '金星': '金牛座/天秤座',
    '火星': '白羊座/天蝎座',
    '木星': '射手座/双鱼座',
    '土星': '摩羯座/水瓶座',
    '天王星': '水瓶座',
    '海王星': '双鱼座',
    '冥王星': '天蝎座',
  };

  for (const [key, value] of Object.entries(zodiacMap)) {
    if (archetype.startsWith(key)) {
      return value;
    }
  }
  return '全星座';
};

// 根据卡牌ID生成显示名称（序号+中文名+核心关键词）
const getCardDisplayName = (id: string, name: string): string => {
  const displayNameMap: Record<string, string> = {
    '1': '金盏花 纯净',
    '2': '圣约翰草 光辉',
    '3': '迷迭香 古老记忆',
    '4': '芸香草 保护',
    '5': '蓝莲花 直觉',
    '6': '鼠尾草 祝福',
    '7': '紫葳木 蜕变',
    '8': '博宾萨纳 信任',
    '9': '洋甘菊 内心的平静',
    '10': '艾草 心理疗愈',
    '11': '达米阿那 挚爱',
    '12': '玫瑰 爱',
    '13': '益母草 力量',
    '14': '木槿 喜悦',
    '15': '西洋蓍草 和谐',
    '16': '刺毛黧豆 旅程',
    '17': '积雪草 更高意识',
    '18': '狮鬃菌 领导力',
    '19': '圣罗勒 财富',
    '20': '薰衣草 编织者',
    '21': '荨麻 行动',
    '22': '蛇根草 转化',
    '23': '乳蓟 和平战士',
    '24': '烟草 奉献',
    '25': '猫爪草 净化',
    '26': '虫草 复苏',
    '27': '灵芝 静修',
    '28': '接骨木 智慧',
    '29': '五味子 优雅',
    '30': '紫锥花 命运',
    '31': '大麻 超脱',
    '32': '康复力 完成',
    '33': '山金车 导师',
    '34': '卡痛叶 变形',
    '35': '木贼草 耐心',
    '36': '古柯叶 预见',
    '37': '红景天 智慧',
    '38': '可可 启蒙',
    '39': '银杏 突破',
    '40': '人参 魔术师',
    '41': '罂粟 梦境',
    '42': '鹅膏菌 通道',
    '43': '西番莲 臣服',
    '44': '缬草 接纳',
    '45': '曼德拉草 感官',
    '46': '曼陀罗花 死亡',
    '47': '头骨草 静止',
    '48': '卡瓦胡椒 社区',
    '49': '裸盖菇 共融',
    '50': '死藤水 重生',
    '51': '龙血树 世界之魂',
    '52': '柠檬香蜂草 滋养',
    '53': '蒲公英 受伤的疗愈者',
    '54': '睡茄 目标',
    '55': '圣木 守护者',
  };

  const shortName = displayNameMap[id] || name;
  return `${id}号牌卡 ${shortName}`;
};

// 将CSV数据转换为OracleCard格式
export const parseCSVData = (data: OracleCardCSV[]): OracleCard[] => {
  return data.map((item) => {
    const uprightKeywords = item.Upright_Keywords.split('、').map(k => k.trim());
    const reversedKeywords = item.Reversed_Keywords.split('、').map(k => k.trim());
    const planet = getPlanetByArchetype(item.Archetype);
    const element = getElementByArchetype(item.Archetype);
    // 直接使用 archetype 字段作为显示的占星原型，而不是自动推断星座
    const zodiac = item.Archetype;

    // 优先使用本地图片，如果没有则使用原URL
    const imageUrl = CARD_IMAGE_MAP[item.ID] || item.Image_URL;

    return {
      id: item.ID,
      name: item.Name.split('(')[0].trim(),
      latinName: item.Latin_Name,
      category: item.Category,
      planetaryGroupArchetype: item.Planetary_Group_Archetype,
      archetype: item.Archetype,
      uprightKeywords,
      reversedKeywords,
      properties: item.Properties,
      physicalDimension: item.Physical_Dimension,
      psychologicalDimension: item.Psychological_Dimension,
      spiritualDimension: item.Spiritual_Dimension,
      // 优先使用本地图片，如果没有则使用原URL
      imageUrl: imageUrl,
      // 根据原型设置渐变色
      color: getColorByArchetype(item.Archetype),
      // 添加显示名称字段
      displayName: getCardDisplayName(item.ID, item.Name.split('(')[0].trim()),
      // 保留旧的interpretation字段用于兼容，但实际显示时会用新的详细解读
      interpretation: `正位关键词：${uprightKeywords.join('、')}`,
      reversedInterpretation: `逆位关键词：${reversedKeywords.join('、')}`,
      practicalGuidance: '',
      spiritualInsight: '',
      planet,
      zodiac,
      element,
    };
  });
};

// 根据原型返回对应的渐变色
const getColorByArchetype = (archetype: string): string => {
  const colorMap: Record<string, string> = {
    '太阳': 'from-orange-400 to-yellow-500',
    '月亮': 'from-slate-400 to-blue-500',
    '水星': 'from-emerald-400 to-cyan-500',
    '金星': 'from-pink-400 to-rose-500',
    '火星': 'from-red-500 to-orange-600',
    '木星': 'from-purple-500 to-indigo-600',
    '土星': 'from-gray-600 to-slate-800',
    '天王星': 'from-cyan-400 to-blue-600',
    '海王星': 'from-indigo-400 to-purple-600',
    '冥王星': 'from-violet-600 to-fuchsia-600',
  };
  
  // 尝试精确匹配
  for (const [key, value] of Object.entries(colorMap)) {
    if (archetype === key || archetype.startsWith(key)) {
      return value;
    }
  }
  
  return 'from-purple-400 to-pink-500';
};

// 获取所有卡牌
export const getOracleCards = (): OracleCard[] => {
  return parseCSVData(csvData);
};

// 洗牌
export const shuffleCards = (cards: OracleCard[]): OracleCard[] => {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 随机获取一张卡
export const getRandomCard = (): OracleCard => {
  const cards = getOracleCards();
  const shuffled = shuffleCards(cards);
  return shuffled[0];
};

// 获取多张卡
export const getMultipleCards = (count: number): OracleCard[] => {
  const cards = getOracleCards();
  const shuffled = shuffleCards(cards);
  return shuffled.slice(0, Math.min(count, cards.length));
};

// 根据ID获取卡
export const getCardById = (id: string): OracleCard | undefined => {
  const cards = getOracleCards();
  return cards.find(card => card.id === id);
};
