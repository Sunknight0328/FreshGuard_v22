/*
# 添加存储方式字段到food_items表

1. 新增字段
  - `storage_method` (text, 默认: 'room_temp', 非空)
    - 可选值: 'refrigerated'(冷藏), 'frozen'(冷冻), 'room_temp'(常温)

2. 说明
  - 不同的存储方式会影响食材的保质期
  - 冷藏：适合蔬菜、水果、乳制品等
  - 冷冻：适合肉类、海鲜等长期保存
  - 常温：适合谷物、调味品等
*/

-- 添加存储方式字段
ALTER TABLE food_items 
ADD COLUMN IF NOT EXISTS storage_method text DEFAULT 'room_temp' NOT NULL;

-- 添加检查约束，确保只能是三个值之一
ALTER TABLE food_items 
ADD CONSTRAINT storage_method_check 
CHECK (storage_method IN ('refrigerated', 'frozen', 'room_temp'));