/*
# 添加手机号字段到profiles表

1. 修改内容
- 在 `profiles` 表中添加 `phone` 字段（text, unique）
- 允许用户使用手机号登录

2. 注意事项
- phone字段可以为空，因为已有用户可能没有手机号
- phone字段必须唯一，避免重复注册
*/

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text UNIQUE;
