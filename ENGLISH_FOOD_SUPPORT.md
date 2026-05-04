# 英文食材支持 - 快速参考

## 概述
v1.7.0 版本新增对英文食材的完整支持，包括分类识别和保质期推荐。

## 支持的英文食材

### 🥬 蔬菜（Vegetables）
**叶菜类**：Cabbage, Spinach, Lettuce, Celery, Kale, Bok Choy  
**根茎类**：Carrot, Potato, Sweet Potato, Ginger, Garlic, Onion, Radish  
**瓜类**：Cucumber, Pumpkin, Zucchini, Squash  
**茄果类**：Tomato, Eggplant, Pepper, Bell Pepper, Chili  
**豆类**：Bean, Green Bean, Pea, Edamame  
**菌菇类**：Mushroom, Shiitake  
**其他**：Broccoli, Cauliflower, Asparagus, Beet

### 🍎 水果（Fruits）
**常见水果**：Apple, Banana, Orange, Grape, Pear, Peach, Plum, Watermelon, Strawberry, Blueberry, Cherry, Raspberry  
**热带水果**：Mango, Pineapple, Dragon Fruit, Kiwi, Papaya, Coconut, Passion Fruit  
**柑橘类**：Lemon, Lime, Grapefruit, Tangerine  
**其他**：Avocado, Pomegranate, Apricot, Fig

### 🥩 肉类（Meat）
**猪肉**：Pork, Pork Belly, Pork Chop, Pork Rib  
**牛肉**：Beef, Steak, Sirloin, Ribeye, Ground Beef  
**羊肉**：Lamb, Mutton, Lamb Chop  
**禽肉**：Chicken, Duck, Turkey, Quail  
**加工肉**：Bacon, Ham, Sausage, Salami, Pepperoni

### 🐟 海鲜（Seafood）
**鱼类**：Fish, Salmon, Tuna, Cod, Bass, Trout, Mackerel  
**虾蟹类**：Shrimp, Prawn, Lobster, Crab  
**贝类**：Scallop, Oyster, Clam, Mussel, Abalone  
**其他**：Squid, Octopus, Seaweed

### 🥛 乳制品（Dairy）
**奶类**：Milk, Yogurt, Soy Milk, Almond Milk, Oat Milk  
**奶酪**：Cheese, Cheddar, Mozzarella, Parmesan, Brie, Feta  
**其他**：Butter, Cream, Sour Cream

### 🥚 蛋类（Eggs）
Egg, Chicken Egg, Duck Egg, Quail Egg

### 🌾 谷物（Grains）
**主食**：Rice, Bread, Pasta, Noodle, Flour  
**杂粮**：Oat, Quinoa, Barley, Corn  
**坚果**：Peanut, Walnut, Almond, Cashew

### 🍪 零食（Snacks）
Cookie, Chip, Chocolate, Candy, Cake, Ice Cream, Popcorn

### 🥤 饮料（Beverages）
**无酒精**：Water, Juice, Coffee, Tea, Soda  
**酒精**：Beer, Wine, Champagne, Vodka, Whiskey

### 🧂 调味品（Condiments）
**基础**：Salt, Sugar, Oil, Vinegar, Honey  
**酱料**：Ketchup, Mayonnaise, Mustard, Soy Sauce  
**香料**：Pepper, Cinnamon, Cumin, Curry, Basil

## 功能特性

### ✅ 自动分类
- 输入英文食材名称
- 自动识别分类
- 无需手动选择

### ✅ 复数处理
- 自动识别复数形式
- apples → apple
- tomatoes → tomato
- berries → berry

### ✅ 智能推荐
- 自动推荐存储方式
- 自动推荐保质期
- 自动计算到期日期

### ✅ 双语支持
- 自动检测输入语言
- 中文/英文自动切换
- 无需手动选择

## 使用示例

### 示例 1：添加苹果
```
1. 输入：Apple
2. 点击：智能推荐
3. 结果：
   - 分类：Fruits ✅
   - 存储方式：Room Temperature ✅
   - 保质期：30 days ✅
```

### 示例 2：添加鸡胸肉
```
1. 输入：Chicken breast
2. 点击：智能推荐
3. 结果：
   - 分类：Meat ✅
   - 存储方式：Refrigerated ✅
   - 保质期：2 days ✅
```

### 示例 3：添加牛奶
```
1. 输入：Milk
2. 点击：智能推荐
3. 结果：
   - 分类：Dairy ✅
   - 存储方式：Refrigerated ✅
   - 保质期：7 days ✅
```

## 常见问题

### Q1：输入复数形式会识别吗？
**A**：会！系统自动处理复数形式。
- Apples → 识别为 Apple → 分类为 Fruits ✅

### Q2：中文功能还能用吗？
**A**：完全可以！中文功能不受任何影响。
- 输入"苹果" → 分类为"水果" ✅

### Q3：如何知道系统使用了哪种语言查询？
**A**：系统自动检测，无需关心。
- 英文输入 → 英文查询
- 中文输入 → 中文查询

### Q4：如果分类不准确怎么办？
**A**：可以手动修改分类。
- 点击分类下拉框
- 选择正确的分类

### Q5：支持哪些英文食材？
**A**：支持 300+ 个常见英文食材。
- 查看上方"支持的英文食材"列表
- 或直接尝试输入

## 技术细节

### 分类算法
1. 标准化输入（小写、去复数）
2. 匹配关键词库（300+ 英文关键词）
3. 返回最佳匹配分类

### 保质期推荐
1. 检测输入语言
2. 使用对应语言查询 AI
3. 从回复中提取天数
4. 返回推荐保质期

### 复数处理规则
- `-ies` → `-y` (berries → berry)
- `-oes` → `-o` (tomatoes → tomato)
- `-es` → `-e` (oranges → orange)
- `-s` → `` (apples → apple)

## 版本信息

**当前版本**：v1.7.0  
**发布日期**：2025-11-19  
**新增功能**：
- ✅ 300+ 英文关键词
- ✅ 复数形式处理
- ✅ 双语查询支持
- ✅ 双语提取逻辑

## 反馈与建议

如果您发现：
- 某个英文食材无法识别
- 分类不准确
- 保质期推荐不合理

请提供以下信息：
1. 输入的食材名称
2. 实际分类结果
3. 预期分类结果
4. 截图（如有）

我们会持续优化和改进！

---

**时鲜管家** - 让食材管理更智能 💚
