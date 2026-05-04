/*
# 时鲜管家 - 初始数据库架构

## 1. 新建表

### profiles 表（用户信息）
- `id` (uuid, 主键, 引用 auth.users)
- `username` (text, 唯一, 非空)
- `email` (text, 唯一)
- `role` (user_role, 默认: 'user', 非空)
- `language_preference` (text, 默认: 'zh', 非空) - 语言偏好设置
- `created_at` (timestamptz, 默认: now())

### food_items 表（食材信息）
- `id` (uuid, 主键, 默认: gen_random_uuid())
- `user_id` (uuid, 引用 profiles.id, 非空)
- `name` (text, 非空) - 食材名称
- `category` (text) - 食材分类
- `purchase_date` (date, 非空) - 购买日期
- `expiry_date` (date, 非空) - 保质期日期
- `quantity` (numeric, 默认: 1) - 数量
- `unit` (text, 默认: '个') - 单位
- `image_url` (text) - 图片URL
- `notes` (text) - 备注
- `created_at` (timestamptz, 默认: now())
- `updated_at` (timestamptz, 默认: now())

### reminders 表（提醒记录）
- `id` (uuid, 主键, 默认: gen_random_uuid())
- `food_item_id` (uuid, 引用 food_items.id, 级联删除)
- `reminder_date` (date, 非空) - 提醒日期
- `reminder_type` (text, 非空) - 提醒类型（'3_days', '1_day'）
- `is_sent` (boolean, 默认: false) - 是否已发送
- `created_at` (timestamptz, 默认: now())

## 2. 安全策略

### profiles 表
- 启用 RLS
- 管理员可以访问所有用户信息
- 普通用户只能查看和更新自己的信息（不能修改角色）

### food_items 表
- 启用 RLS
- 管理员可以查看所有食材
- 普通用户只能管理自己的食材

### reminders 表
- 启用 RLS
- 用户只能查看自己食材的提醒记录

## 3. 存储桶

- 创建公开的食材图片存储桶
- 认证用户可以上传图片
- 所有人可以查看图片

## 4. 触发器

- 创建用户注册触发器，首位用户自动成为管理员
- 创建食材更新时间触发器

## 5. 辅助函数

- `is_admin()` - 检查用户是否为管理员
- `calculate_days_until_expiry()` - 计算距离保质期的天数
*/

-- 创建用户角色枚举
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- 创建 profiles 表
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  email text UNIQUE,
  role user_role DEFAULT 'user'::user_role NOT NULL,
  language_preference text DEFAULT 'zh' NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 创建 food_items 表
CREATE TABLE IF NOT EXISTS food_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  category text,
  purchase_date date NOT NULL,
  expiry_date date NOT NULL,
  quantity numeric DEFAULT 1,
  unit text DEFAULT '个',
  image_url text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建 reminders 表
CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  food_item_id uuid REFERENCES food_items(id) ON DELETE CASCADE NOT NULL,
  reminder_date date NOT NULL,
  reminder_type text NOT NULL CHECK (reminder_type IN ('3_days', '1_day')),
  is_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_food_items_user_id ON food_items(user_id);
CREATE INDEX IF NOT EXISTS idx_food_items_expiry_date ON food_items(expiry_date);
CREATE INDEX IF NOT EXISTS idx_reminders_food_item_id ON reminders(food_item_id);
CREATE INDEX IF NOT EXISTS idx_reminders_reminder_date ON reminders(reminder_date);

-- 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- 创建管理员检查函数
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- 创建计算保质期剩余天数的函数
CREATE OR REPLACE FUNCTION calculate_days_until_expiry(expiry_date date)
RETURNS integer LANGUAGE sql IMMUTABLE AS $$
  SELECT (expiry_date - CURRENT_DATE)::integer;
$$;

-- profiles 表的 RLS 策略
CREATE POLICY "管理员可以访问所有用户信息" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "用户可以查看自己的信息" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "用户可以更新自己的信息（不能修改角色）" ON profiles
  FOR UPDATE TO authenticated 
  USING (auth.uid() = id) 
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- food_items 表的 RLS 策略
CREATE POLICY "管理员可以查看所有食材" ON food_items
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "用户可以查看自己的食材" ON food_items
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "用户可以添加自己的食材" ON food_items
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的食材" ON food_items
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的食材" ON food_items
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- reminders 表的 RLS 策略
CREATE POLICY "用户可以查看自己食材的提醒" ON reminders
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM food_items fi
      WHERE fi.id = reminders.food_item_id AND fi.user_id = auth.uid()
    )
  );

CREATE POLICY "用户可以添加自己食材的提醒" ON reminders
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM food_items fi
      WHERE fi.id = reminders.food_item_id AND fi.user_id = auth.uid()
    )
  );

CREATE POLICY "用户可以更新自己食材的提醒" ON reminders
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM food_items fi
      WHERE fi.id = reminders.food_item_id AND fi.user_id = auth.uid()
    )
  );

CREATE POLICY "用户可以删除自己食材的提醒" ON reminders
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM food_items fi
      WHERE fi.id = reminders.food_item_id AND fi.user_id = auth.uid()
    )
  );

-- 创建用户注册触发器（首位用户自动成为管理员）
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
  new_username text;
BEGIN
  -- 只在用户经过验证后再插入profiles
  IF OLD IS DISTINCT FROM NULL AND OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL THEN
    -- 判断 profiles 表里有多少用户
    SELECT COUNT(*) INTO user_count FROM profiles;
    
    -- 从邮箱中提取用户名（去掉@miaoda.com后缀）
    new_username := REPLACE(NEW.email, '@miaoda.com', '');
    
    -- 插入 profiles，首位用户给 admin 角色
    INSERT INTO profiles (id, username, email, role)
    VALUES (
      NEW.id,
      new_username,
      NEW.email,
      CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'user'::user_role END
    );
  END IF;
  RETURN NEW;
END;
$$;

-- 绑定触发器到 auth.users 表
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 创建食材更新时间触发器
CREATE OR REPLACE FUNCTION update_food_item_timestamp()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_food_items_timestamp
  BEFORE UPDATE ON food_items
  FOR EACH ROW
  EXECUTE FUNCTION update_food_item_timestamp();

-- 创建存储桶用于食材图片
INSERT INTO storage.buckets (id, name, public)
VALUES ('app-7noqonmn18g1_food_images', 'app-7noqonmn18g1_food_images', true)
ON CONFLICT (id) DO NOTHING;

-- 设置存储桶策略
CREATE POLICY "所有认证用户可以上传图片" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'app-7noqonmn18g1_food_images');

CREATE POLICY "所有人可以查看图片" ON storage.objects
  FOR SELECT USING (bucket_id = 'app-7noqonmn18g1_food_images');

CREATE POLICY "用户可以删除自己上传的图片" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'app-7noqonmn18g1_food_images');
