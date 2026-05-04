/**
 * 食材分类辅助函数
 * 根据食材名称智能推荐分类
 */

export type FoodCategory = 
  | 'vegetables' 
  | 'fruits' 
  | 'meat' 
  | 'seafood' 
  | 'dairy' 
  | 'eggs' 
  | 'grains' 
  | 'snacks' 
  | 'beverages' 
  | 'condiments' 
  | 'other';

// 分类关键词映射（支持中英文）
const categoryKeywords: Record<FoodCategory, string[]> = {
  vegetables: [
    // 叶菜类 - 中文
    '白菜', '大白菜', '小白菜', '青菜', '油菜', '菠菜', '生菜', '莴苣', '芹菜', '韭菜', '香菜', '茼蒿',
    // 叶菜类 - 英文
    'cabbage', 'napa cabbage', 'bok choy', 'pak choi', 'spinach', 'lettuce', 'celery', 'leek', 'cilantro', 'coriander', 'parsley',
    // 根茎类 - 中文
    '萝卜', '胡萝卜', '白萝卜', '红萝卜', '土豆', '马铃薯', '红薯', '地瓜', '山药', '芋头', '莲藕', '藕',
    '姜', '生姜', '大蒜', '蒜', '洋葱', '葱', '大葱', '小葱',
    // 根茎类 - 英文
    'radish', 'carrot', 'potato', 'sweet potato', 'yam', 'taro', 'lotus root', 'ginger', 'garlic', 'onion', 'scallion', 'green onion', 'spring onion',
    // 瓜类 - 中文
    '黄瓜', '冬瓜', '南瓜', '丝瓜', '苦瓜', '西葫芦', '葫芦',
    // 瓜类 - 英文
    'cucumber', 'winter melon', 'pumpkin', 'squash', 'zucchini', 'bitter melon', 'gourd',
    // 茄果类 - 中文
    '西红柿', '番茄', '茄子', '青椒', '辣椒', '彩椒', '甜椒', '尖椒',
    // 茄果类 - 英文
    'tomato', 'eggplant', 'aubergine', 'pepper', 'bell pepper', 'chili', 'chilli', 'jalapeno',
    // 豆类 - 中文
    '豆角', '四季豆', '豇豆', '扁豆', '豌豆', '毛豆', '蚕豆',
    // 豆类 - 英文
    'bean', 'green bean', 'string bean', 'pea', 'edamame', 'broad bean', 'fava bean',
    // 菌菇类 - 中文
    '蘑菇', '香菇', '平菇', '金针菇', '杏鲍菇', '木耳', '银耳',
    // 菌菇类 - 英文
    'mushroom', 'shiitake', 'oyster mushroom', 'enoki', 'king oyster mushroom', 'wood ear', 'black fungus',
    // 其他 - 中文
    '花菜', '菜花', '西兰花', '包菜', '卷心菜', '娃娃菜', '油麦菜', '空心菜',
    // 其他 - 英文
    'cauliflower', 'broccoli', 'kale', 'brussels sprout', 'asparagus', 'artichoke', 'beet', 'beetroot', 'turnip',
  ],
  
  fruits: [
    // 常见水果 - 中文
    '苹果', '香蕉', '橙子', '橘子', '柑橘', '柚子', '葡萄', '梨', '桃', '桃子', '李子',
    '西瓜', '哈密瓜', '甜瓜', '草莓', '蓝莓', '樱桃', '车厘子',
    // 常见水果 - 英文
    'apple', 'banana', 'orange', 'tangerine', 'mandarin', 'grapefruit', 'grape', 'pear', 'peach', 'plum',
    'watermelon', 'cantaloupe', 'melon', 'strawberry', 'blueberry', 'cherry', 'raspberry', 'blackberry',
    // 热带水果 - 中文
    '芒果', '菠萝', '凤梨', '火龙果', '榴莲', '山竹', '荔枝', '龙眼', '桂圆',
    '木瓜', '椰子', '猕猴桃', '奇异果',
    // 热带水果 - 英文
    'mango', 'pineapple', 'dragon fruit', 'pitaya', 'durian', 'mangosteen', 'lychee', 'longan',
    'papaya', 'coconut', 'kiwi', 'kiwifruit', 'passion fruit',
    // 其他 - 中文
    '柠檬', '石榴', '枇杷', '杨梅', '杏', '枣', '红枣', '柿子',
    // 其他 - 英文
    'lemon', 'lime', 'pomegranate', 'apricot', 'date', 'persimmon', 'fig', 'avocado', 'guava',
  ],
  
  meat: [
    // 猪肉 - 中文
    '猪肉', '五花肉', '里脊肉', '排骨', '猪排', '猪蹄', '猪脚', '猪肝', '猪心', '猪肚',
    // 猪肉 - 英文
    'pork', 'pork belly', 'pork loin', 'pork chop', 'pork rib', 'pork trotter', 'pork liver', 'pork heart',
    // 牛肉 - 中文
    '牛肉', '牛排', '牛腩', '牛腱', '牛尾',
    // 牛肉 - 英文
    'beef', 'steak', 'brisket', 'sirloin', 'ribeye', 'tenderloin', 'filet', 'ground beef', 'beef shank', 'oxtail',
    // 羊肉 - 中文
    '羊肉', '羊排', '羊腿', '羊蝎子',
    // 羊肉 - 英文
    'lamb', 'mutton', 'lamb chop', 'lamb shank', 'lamb leg',
    // 禽肉 - 中文
    '鸡肉', '鸡腿', '鸡翅', '鸡胸肉', '鸡爪', '鸡翅膀', '鸡翅根',
    '鸭肉', '鸭腿', '鸭胸', '鸭掌',
    '鹅肉',
    // 禽肉 - 英文
    'chicken', 'chicken breast', 'chicken thigh', 'chicken wing', 'chicken drumstick', 'chicken leg',
    'duck', 'duck breast', 'duck leg',
    'goose', 'turkey', 'quail',
    // 其他 - 中文
    '培根', '火腿', '香肠', '腊肉', '腊肠', '肉丸', '肉馅', '绞肉',
    // 其他 - 英文
    'bacon', 'ham', 'sausage', 'salami', 'pepperoni', 'meatball', 'ground meat', 'minced meat', 'patty',
  ],
  
  seafood: [
    // 鱼类 - 中文
    '鱼', '鲈鱼', '鲫鱼', '草鱼', '鲤鱼', '带鱼', '黄鱼', '三文鱼', '鳕鱼', '金枪鱼',
    // 鱼类 - 英文
    'fish', 'bass', 'carp', 'salmon', 'cod', 'tuna', 'trout', 'tilapia', 'halibut', 'mackerel', 'sardine', 'anchovy',
    // 虾类 - 中文
    '虾', '大虾', '对虾', '基围虾', '龙虾', '小龙虾', '虾仁',
    // 虾类 - 英文
    'shrimp', 'prawn', 'lobster', 'crayfish', 'crawfish',
    // 蟹类 - 中文
    '螃蟹', '大闸蟹', '梭子蟹', '帝王蟹',
    // 蟹类 - 英文
    'crab', 'king crab', 'snow crab', 'blue crab',
    // 贝类 - 中文
    '扇贝', '生蚝', '牡蛎', '蛤蜊', '花蛤', '蚬子', '鲍鱼', '海螺',
    // 贝类 - 英文
    'scallop', 'oyster', 'clam', 'mussel', 'abalone', 'conch', 'whelk',
    // 其他 - 中文
    '鱿鱼', '墨鱼', '章鱼', '八爪鱼', '海参', '海蜇', '海带', '紫菜',
    // 其他 - 英文
    'squid', 'cuttlefish', 'octopus', 'sea cucumber', 'jellyfish', 'seaweed', 'kelp', 'nori',
  ],
  
  dairy: [
    // 中文
    '牛奶', '鲜奶', '纯牛奶', '酸奶', '酸牛奶', '乳酸菌', '优酸乳',
    '奶酪', '芝士', '黄油', '奶油', '淡奶油', '炼乳',
    '奶粉', '豆奶', '豆浆',
    // 英文
    'milk', 'fresh milk', 'whole milk', 'skim milk', 'yogurt', 'yoghurt', 'kefir',
    'cheese', 'cheddar', 'mozzarella', 'parmesan', 'brie', 'feta', 'gouda',
    'butter', 'cream', 'heavy cream', 'whipping cream', 'sour cream', 'condensed milk',
    'milk powder', 'soy milk', 'almond milk', 'oat milk',
  ],
  
  eggs: [
    // 中文
    '鸡蛋', '鸭蛋', '鹅蛋', '鹌鹑蛋', '皮蛋', '松花蛋', '咸蛋', '咸鸭蛋',
    // 英文
    'egg', 'chicken egg', 'duck egg', 'goose egg', 'quail egg', 'century egg', 'salted egg',
  ],
  
  grains: [
    // 主食 - 中文
    '大米', '米', '面粉', '小麦粉', '面条', '挂面', '意面', '通心粉',
    '馒头', '包子', '饺子', '馄饨', '面包', '吐司', '切片面包',
    // 主食 - 英文
    'rice', 'white rice', 'brown rice', 'flour', 'wheat flour', 'noodle', 'pasta', 'spaghetti', 'macaroni',
    'bread', 'toast', 'baguette', 'bagel', 'croissant', 'bun', 'roll',
    // 杂粮 - 中文
    '小米', '黑米', '糙米', '糯米', '玉米', '燕麦', '麦片', '藜麦',
    '红豆', '绿豆', '黄豆', '黑豆', '芸豆', '花生', '核桃', '杏仁',
    // 杂粮 - 英文
    'millet', 'black rice', 'glutinous rice', 'corn', 'maize', 'oat', 'oatmeal', 'quinoa', 'barley',
    'red bean', 'mung bean', 'soybean', 'black bean', 'kidney bean', 'peanut', 'walnut', 'almond', 'cashew', 'pistachio',
  ],
  
  snacks: [
    // 中文
    '饼干', '薯片', '薯条', '爆米花', '巧克力', '糖果', '软糖', '棒棒糖',
    '蛋糕', '点心', '月饼', '曲奇', '威化', '夹心饼干',
    '瓜子', '花生米', '坚果', '腰果', '开心果', '松子',
    '果冻', '布丁', '冰淇淋', '雪糕', '冰棍',
    // 英文
    'cookie', 'biscuit', 'cracker', 'chip', 'crisp', 'french fry', 'popcorn', 'chocolate', 'candy', 'lollipop',
    'cake', 'cupcake', 'muffin', 'donut', 'doughnut', 'wafer', 'pretzel',
    'nut', 'mixed nut', 'trail mix',
    'jelly', 'pudding', 'ice cream', 'popsicle', 'gelato', 'sorbet',
  ],
  
  beverages: [
    // 中文
    '水', '矿泉水', '纯净水', '苏打水', '气泡水',
    '果汁', '橙汁', '苹果汁', '葡萄汁', '西瓜汁',
    '可乐', '雪碧', '芬达', '汽水', '碳酸饮料',
    '茶', '绿茶', '红茶', '乌龙茶', '奶茶', '茶叶',
    '咖啡', '速溶咖啡', '咖啡豆',
    '啤酒', '红酒', '白酒', '黄酒', '米酒',
    // 英文
    'water', 'mineral water', 'sparkling water', 'soda water', 'tonic water',
    'juice', 'orange juice', 'apple juice', 'grape juice', 'cranberry juice', 'lemonade',
    'cola', 'coke', 'pepsi', 'sprite', 'fanta', 'soda', 'pop',
    'tea', 'green tea', 'black tea', 'oolong tea', 'herbal tea', 'chai', 'matcha',
    'coffee', 'espresso', 'cappuccino', 'latte', 'americano', 'mocha',
    'beer', 'wine', 'red wine', 'white wine', 'champagne', 'sake', 'vodka', 'whiskey', 'rum', 'gin',
  ],
  
  condiments: [
    // 基础调味料 - 中文
    '盐', '食盐', '糖', '白糖', '红糖', '冰糖',
    '酱油', '生抽', '老抽', '醋', '陈醋', '米醋', '香醋',
    '油', '食用油', '花生油', '菜籽油', '玉米油', '橄榄油', '芝麻油', '香油',
    // 基础调味料 - 英文
    'salt', 'sea salt', 'sugar', 'brown sugar', 'honey', 'syrup', 'maple syrup',
    'soy sauce', 'vinegar', 'balsamic vinegar', 'apple cider vinegar', 'rice vinegar',
    'oil', 'cooking oil', 'olive oil', 'vegetable oil', 'canola oil', 'sesame oil', 'coconut oil',
    // 酱料 - 中文
    '番茄酱', '沙拉酱', '蛋黄酱', '辣椒酱', '豆瓣酱', '甜面酱', '黄豆酱', '芝麻酱',
    '蚝油', '鱼露', '料酒', '黄酒',
    // 酱料 - 英文
    'ketchup', 'tomato sauce', 'mayonnaise', 'mayo', 'mustard', 'hot sauce', 'chili sauce', 'salsa',
    'bbq sauce', 'teriyaki sauce', 'worcestershire sauce', 'oyster sauce', 'fish sauce', 'hoisin sauce',
    // 香料 - 中文
    '味精', '鸡精', '十三香', '五香粉', '胡椒粉', '花椒', '八角', '桂皮', '香叶',
    '孜然', '咖喱', '辣椒粉', '芝麻',
    // 香料 - 英文
    'msg', 'pepper', 'black pepper', 'white pepper', 'paprika', 'cumin', 'curry', 'turmeric',
    'cinnamon', 'nutmeg', 'clove', 'bay leaf', 'thyme', 'rosemary', 'oregano', 'basil', 'mint',
    'chili powder', 'cayenne', 'sesame seed',
  ],
  
  other: [],
};

/**
 * 标准化食材名称（处理复数、大小写等）
 * @param foodName 食材名称
 * @returns 标准化后的名称
 */
function normalizeFoodName(foodName: string): string {
  let normalized = foodName.trim().toLowerCase();
  
  // 移除常见的复数形式
  if (normalized.endsWith('ies')) {
    // berries -> berry
    normalized = normalized.slice(0, -3) + 'y';
  } else if (normalized.endsWith('es')) {
    // tomatoes -> tomato, potatoes -> potato
    if (normalized.endsWith('oes')) {
      normalized = normalized.slice(0, -2);
    } else if (normalized.endsWith('shes') || normalized.endsWith('ches') || normalized.endsWith('xes')) {
      // dishes -> dish, peaches -> peach, boxes -> box
      normalized = normalized.slice(0, -2);
    } else {
      // oranges -> orange
      normalized = normalized.slice(0, -1);
    }
  } else if (normalized.endsWith('s') && !normalized.endsWith('ss')) {
    // apples -> apple (但不处理 grass -> gras)
    normalized = normalized.slice(0, -1);
  }
  
  return normalized;
}

/**
 * 根据食材名称智能推荐分类
 * @param foodName 食材名称
 * @returns 推荐的分类
 */
export function classifyFood(foodName: string): FoodCategory {
  if (!foodName || foodName.trim() === '') {
    return 'other';
  }

  const name = normalizeFoodName(foodName);

  // 遍历所有分类，查找匹配的关键词
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      const normalizedKeyword = normalizeFoodName(keyword);
      
      // 完全匹配
      if (name === normalizedKeyword) {
        return category as FoodCategory;
      }
      
      // 包含匹配
      if (name.includes(normalizedKeyword) || normalizedKeyword.includes(name)) {
        return category as FoodCategory;
      }
    }
  }

  // 如果没有匹配到任何关键词，返回"其他"
  return 'other';
}

/**
 * 批量分类食材
 * @param foodNames 食材名称数组
 * @returns 分类结果数组
 */
export function classifyFoods(foodNames: string[]): FoodCategory[] {
  return foodNames.map(name => classifyFood(name));
}

/**
 * 获取分类的置信度（0-1之间）
 * @param foodName 食材名称
 * @param category 分类
 * @returns 置信度分数
 */
export function getCategoryConfidence(foodName: string, category: FoodCategory): number {
  if (!foodName || foodName.trim() === '') {
    return 0;
  }

  const name = foodName.trim().toLowerCase();
  const keywords = categoryKeywords[category];

  // 检查是否有完全匹配
  for (const keyword of keywords) {
    if (name === keyword.toLowerCase()) {
      return 1.0; // 完全匹配，置信度100%
    }
  }

  // 检查是否包含关键词
  for (const keyword of keywords) {
    if (name.includes(keyword.toLowerCase())) {
      return 0.8; // 部分匹配，置信度80%
    }
  }

  return 0; // 不匹配
}

/**
 * 获取所有可能的分类及其置信度
 * @param foodName 食材名称
 * @returns 分类和置信度的数组，按置信度降序排列
 */
export function getAllPossibleCategories(foodName: string): Array<{ category: FoodCategory; confidence: number }> {
  const categories: FoodCategory[] = [
    'vegetables', 'fruits', 'meat', 'seafood', 'dairy', 
    'eggs', 'grains', 'snacks', 'beverages', 'condiments', 'other'
  ];

  const results = categories
    .map(category => ({
      category,
      confidence: getCategoryConfidence(foodName, category),
    }))
    .filter(result => result.confidence > 0)
    .sort((a, b) => b.confidence - a.confidence);

  // 如果没有任何匹配，返回"其他"分类
  if (results.length === 0) {
    return [{ category: 'other', confidence: 0.5 }];
  }

  return results;
}
