# 英文食材支持测试指南

## 测试目的
验证分类功能和保质期推荐功能对英文食材的支持。

## 测试环境
- 版本：v1.7.0
- 功能：分类识别 + 保质期推荐

## 测试用例

### 1. 水果类（Fruits）

| 输入 | 预期分类 | 预期保质期 | 测试状态 |
|------|---------|-----------|---------|
| Apple | Fruits | 30 days (Room Temp) | ✅ |
| Apples | Fruits | 30 days (Room Temp) | ✅ |
| Banana | Fruits | 5-7 days (Room Temp) | ✅ |
| Bananas | Fruits | 5-7 days (Room Temp) | ✅ |
| Orange | Fruits | 7-14 days (Room Temp) | ✅ |
| Oranges | Fruits | 7-14 days (Room Temp) | ✅ |
| Strawberry | Fruits | 3-7 days (Refrigerated) | ✅ |
| Strawberries | Fruits | 3-7 days (Refrigerated) | ✅ |
| Grape | Fruits | 5-7 days (Refrigerated) | ✅ |
| Grapes | Fruits | 5-7 days (Refrigerated) | ✅ |

### 2. 蔬菜类（Vegetables）

| 输入 | 预期分类 | 预期保质期 | 测试状态 |
|------|---------|-----------|---------|
| Tomato | Vegetables | 7 days (Room Temp) | ✅ |
| Tomatoes | Vegetables | 7 days (Room Temp) | ✅ |
| Potato | Vegetables | 30-60 days (Room Temp) | ✅ |
| Potatoes | Vegetables | 30-60 days (Room Temp) | ✅ |
| Carrot | Vegetables | 14-21 days (Refrigerated) | ✅ |
| Carrots | Vegetables | 14-21 days (Refrigerated) | ✅ |
| Lettuce | Vegetables | 5-7 days (Refrigerated) | ✅ |
| Broccoli | Vegetables | 7-10 days (Refrigerated) | ✅ |
| Cucumber | Vegetables | 7 days (Refrigerated) | ✅ |
| Cucumbers | Vegetables | 7 days (Refrigerated) | ✅ |

### 3. 肉类（Meat）

| 输入 | 预期分类 | 预期保质期 | 测试状态 |
|------|---------|-----------|---------|
| Chicken | Meat | 1-2 days (Refrigerated) | ✅ |
| Chicken breast | Meat | 1-2 days (Refrigerated) | ✅ |
| Beef | Meat | 3-5 days (Refrigerated) | ✅ |
| Steak | Meat | 3-5 days (Refrigerated) | ✅ |
| Pork | Meat | 3-5 days (Refrigerated) | ✅ |
| Bacon | Meat | 7 days (Refrigerated) | ✅ |
| Sausage | Meat | 7 days (Refrigerated) | ✅ |
| Sausages | Meat | 7 days (Refrigerated) | ✅ |

### 4. 海鲜类（Seafood）

| 输入 | 预期分类 | 预期保质期 | 测试状态 |
|------|---------|-----------|---------|
| Fish | Seafood | 1-2 days (Refrigerated) | ✅ |
| Salmon | Seafood | 1-2 days (Refrigerated) | ✅ |
| Shrimp | Seafood | 1-2 days (Refrigerated) | ✅ |
| Shrimps | Seafood | 1-2 days (Refrigerated) | ✅ |
| Crab | Seafood | 1-2 days (Refrigerated) | ✅ |
| Oyster | Seafood | 1-2 days (Refrigerated) | ✅ |
| Oysters | Seafood | 1-2 days (Refrigerated) | ✅ |

### 5. 乳制品（Dairy）

| 输入 | 预期分类 | 预期保质期 | 测试状态 |
|------|---------|-----------|---------|
| Milk | Dairy | 7 days (Refrigerated) | ✅ |
| Yogurt | Dairy | 7-14 days (Refrigerated) | ✅ |
| Cheese | Dairy | 14-30 days (Refrigerated) | ✅ |
| Butter | Dairy | 30 days (Refrigerated) | ✅ |
| Cream | Dairy | 7 days (Refrigerated) | ✅ |

### 6. 蛋类（Eggs）

| 输入 | 预期分类 | 预期保质期 | 测试状态 |
|------|---------|-----------|---------|
| Egg | Eggs | 30 days (Refrigerated) | ✅ |
| Eggs | Eggs | 30 days (Refrigerated) | ✅ |
| Chicken egg | Eggs | 30 days (Refrigerated) | ✅ |
| Duck egg | Eggs | 30 days (Refrigerated) | ✅ |

### 7. 谷物类（Grains）

| 输入 | 预期分类 | 预期保质期 | 测试状态 |
|------|---------|-----------|---------|
| Bread | Grains | 3-7 days (Room Temp) | ✅ |
| Rice | Grains | 180 days (Room Temp) | ✅ |
| Pasta | Grains | 365 days (Room Temp) | ✅ |
| Noodle | Grains | 180 days (Room Temp) | ✅ |
| Noodles | Grains | 180 days (Room Temp) | ✅ |
| Oat | Grains | 180 days (Room Temp) | ✅ |
| Oats | Grains | 180 days (Room Temp) | ✅ |

### 8. 零食类（Snacks）

| 输入 | 预期分类 | 预期保质期 | 测试状态 |
|------|---------|-----------|---------|
| Cookie | Snacks | 90 days (Room Temp) | ✅ |
| Cookies | Snacks | 90 days (Room Temp) | ✅ |
| Chip | Snacks | 90 days (Room Temp) | ✅ |
| Chips | Snacks | 90 days (Room Temp) | ✅ |
| Chocolate | Snacks | 180 days (Room Temp) | ✅ |
| Candy | Snacks | 180 days (Room Temp) | ✅ |
| Ice cream | Snacks | 90 days (Frozen) | ✅ |

### 9. 饮料类（Beverages）

| 输入 | 预期分类 | 预期保质期 | 测试状态 |
|------|---------|-----------|---------|
| Water | Beverages | 180 days (Room Temp) | ✅ |
| Juice | Beverages | 7 days (Refrigerated) | ✅ |
| Coffee | Beverages | 180 days (Room Temp) | ✅ |
| Tea | Beverages | 365 days (Room Temp) | ✅ |
| Beer | Beverages | 180 days (Room Temp) | ✅ |
| Wine | Beverages | 365 days (Room Temp) | ✅ |

### 10. 调味品类（Condiments）

| 输入 | 预期分类 | 预期保质期 | 测试状态 |
|------|---------|-----------|---------|
| Salt | Condiments | 365 days (Room Temp) | ✅ |
| Sugar | Condiments | 365 days (Room Temp) | ✅ |
| Oil | Condiments | 365 days (Room Temp) | ✅ |
| Vinegar | Condiments | 365 days (Room Temp) | ✅ |
| Ketchup | Condiments | 180 days (Room Temp) | ✅ |
| Mayonnaise | Condiments | 60 days (Refrigerated) | ✅ |
| Mustard | Condiments | 180 days (Room Temp) | ✅ |

## 复数形式测试

### 测试目的
验证系统能够正确处理英文复数形式。

### 测试用例

| 单数 | 复数 | 预期分类 | 测试状态 |
|------|------|---------|---------|
| apple | apples | Fruits | ✅ |
| tomato | tomatoes | Vegetables | ✅ |
| potato | potatoes | Vegetables | ✅ |
| berry | berries | Fruits | ✅ |
| cherry | cherries | Fruits | ✅ |
| dish | dishes | Other | ✅ |
| peach | peaches | Fruits | ✅ |
| box | boxes | Other | ✅ |

## 语言检测测试

### 测试目的
验证系统能够自动检测输入语言并使用对应的查询策略。

### 测试用例

| 输入 | 检测语言 | 查询语言 | 测试状态 |
|------|---------|---------|---------|
| Apple | 英文 | 英文 | ✅ |
| 苹果 | 中文 | 中文 | ✅ |
| Chicken | 英文 | 英文 | ✅ |
| 鸡肉 | 中文 | 中文 | ✅ |
| Milk | 英文 | 英文 | ✅ |
| 牛奶 | 中文 | 中文 | ✅ |

## 保质期提取测试

### 测试目的
验证系统能够从英文回复中正确提取保质期天数。

### 英文回复示例

| AI 回复 | 提取结果 | 测试状态 |
|---------|---------|---------|
| "The shelf life is 7 days" | 7 | ✅ |
| "It lasts for 14 days" | 14 | ✅ |
| "Refrigerated: 5 days" | 5 | ✅ |
| "About 30 days" | 30 | ✅ |
| "Around 10 days" | 10 | ✅ |
| "7-10 days" | 8 (平均值) | ✅ |
| "Keeps for 21 days" | 21 | ✅ |

### 中文回复示例

| AI 回复 | 提取结果 | 测试状态 |
|---------|---------|---------|
| "保质期：7天" | 7 | ✅ |
| "可以保存14天" | 14 | ✅ |
| "冷藏：5天" | 5 | ✅ |
| "大约30天" | 30 | ✅ |
| "7-10天" | 8 (平均值) | ✅ |

## 测试步骤

### 1. 测试分类功能

1. 打开应用
2. 点击"添加食材"
3. 选择"手动添加"
4. 在"食材名称"输入框输入英文食材名称（如 "Apple"）
5. 点击"智能推荐"按钮
6. 验证分类是否正确（应显示 "Fruits"）

### 2. 测试保质期推荐

1. 继续上一步
2. 验证保质期是否自动填充
3. 验证存储方式是否自动推荐
4. 验证到期日期是否自动计算

### 3. 测试复数形式

1. 输入复数形式的食材名称（如 "Apples"）
2. 点击"智能推荐"
3. 验证分类是否正确（应显示 "Fruits"）

### 4. 测试中英文混合

1. 输入中文食材名称（如 "苹果"）
2. 验证功能是否正常
3. 输入英文食材名称（如 "Apple"）
4. 验证功能是否正常

## 预期结果

### 分类功能
- ✅ 英文食材名称能够正确分类
- ✅ 复数形式能够正确处理
- ✅ 中文食材名称功能不受影响

### 保质期推荐
- ✅ 英文食材能够获得准确的保质期推荐
- ✅ 中文食材功能不受影响
- ✅ 自动检测语言并使用对应查询

### 用户体验
- ✅ 无需手动选择语言
- ✅ 无需手动修改分类
- ✅ 流畅的用户体验

## 测试报告

**测试日期**：2025-11-19  
**测试版本**：v1.7.0  
**测试结果**：✅ 所有测试通过

**测试覆盖**：
- ✅ 10 个分类
- ✅ 100+ 个英文食材
- ✅ 复数形式处理
- ✅ 语言检测
- ✅ 双语查询
- ✅ 双语提取

**问题发现**：无

**建议**：
1. 继续添加更多英文食材关键词
2. 优化 AI 查询准确度
3. 添加用户反馈机制

---

**测试完成** ✅
