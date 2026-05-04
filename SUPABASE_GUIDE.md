# Supabase 后端服务说明

## 📋 概述

**是的，这个项目已经集成了 Supabase！**

时鲜管家应用使用 **Supabase** 作为后端服务，提供：
- 🗄️ **PostgreSQL 数据库** - 存储用户、食材、提醒等数据
- 🔐 **用户认证** - 登录、注册、权限管理
- 📁 **文件存储** - 图片上传和存储
- 🔒 **行级安全策略（RLS）** - 数据访问控制

---

## 🏗️ 项目中的 Supabase 集成

### 1. 已有的配置文件

#### src/db/supabase.ts
Supabase 客户端初始化文件：
```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

#### supabase/migrations/
数据库迁移文件目录，包含：
- `01_create_initial_schema.sql` - 初始数据库架构
- `02_add_phone_to_profiles.sql` - 添加手机号字段
- `03_add_storage_method_to_food_items.sql` - 添加存储方式字段

### 2. 数据库表结构

项目使用以下数据库表：

#### profiles（用户配置表）
```sql
- id (uuid, 主键)
- username (text, 用户名)
- role (text, 角色：admin/user)
- language (text, 语言偏好)
- phone (text, 手机号)
- created_at (timestamp)
```

#### food_items（食材表）
```sql
- id (uuid, 主键)
- user_id (uuid, 外键 → profiles.id)
- name (text, 食材名称)
- category (text, 分类)
- purchase_date (date, 购买日期)
- expiry_date (date, 过期日期)
- storage_method (text, 存储方式)
- quantity (numeric, 数量)
- unit (text, 单位)
- notes (text, 备注)
- image_url (text, 图片URL)
- created_at (timestamp)
```

#### reminders（提醒表）
```sql
- id (uuid, 主键)
- user_id (uuid, 外键 → profiles.id)
- food_item_id (uuid, 外键 → food_items.id)
- reminder_date (date, 提醒日期)
- message (text, 提醒消息)
- is_read (boolean, 是否已读)
- created_at (timestamp)
```

---

## 🔑 环境变量配置

### 需要配置的环境变量

项目需要以下 Supabase 环境变量：

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 如何获取这些值？

**方式 1：使用现有的 Supabase 项目**

如果您已经有 Supabase 项目：

1. 登录 [Supabase Dashboard](https://app.supabase.com/)
2. 选择您的项目
3. 进入 **Settings** → **API**
4. 复制以下信息：
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

**方式 2：创建新的 Supabase 项目**

如果您还没有 Supabase 项目：

1. 访问 [Supabase](https://supabase.com/)
2. 点击 **Start your project**
3. 使用 GitHub 账号登录
4. 点击 **New Project**
5. 填写项目信息：
   - Name: `freshguard` 或您喜欢的名称
   - Database Password: 设置一个强密码（请记住！）
   - Region: 选择离您最近的区域（如 `Northeast Asia (Tokyo)`）
6. 点击 **Create new project**
7. 等待项目创建完成（约 2 分钟）
8. 进入 **Settings** → **API** 获取配置信息

### 配置环境变量

**开发环境**：

创建 `.env.local` 文件（在项目根目录）：
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**生产环境**：

在部署平台（Vercel、Netlify 等）的环境变量设置中添加这两个变量。

---

## 🗄️ 数据库初始化

### 方式 1：使用迁移文件（推荐）

项目已经包含了数据库迁移文件，您可以直接应用：

```bash
# 1. 安装 Supabase CLI（如果还没安装）
npm install -g supabase

# 2. 登录 Supabase
supabase login

# 3. 链接到您的项目
supabase link --project-ref your-project-id

# 4. 应用迁移
supabase db push
```

### 方式 2：手动执行 SQL

如果您不想使用 CLI，可以在 Supabase Dashboard 中手动执行 SQL：

1. 进入 Supabase Dashboard
2. 选择您的项目
3. 进入 **SQL Editor**
4. 依次执行以下文件中的 SQL：
   - `supabase/migrations/01_create_initial_schema.sql`
   - `supabase/migrations/02_add_phone_to_profiles.sql`
   - `supabase/migrations/03_add_storage_method_to_food_items.sql`

### 方式 3：使用平台工具

如果您使用的是秒哒平台或类似的开发平台，它们通常会自动处理 Supabase 的初始化和配置。

---

## 📁 文件存储配置

### 创建 Storage Bucket

项目需要一个用于存储食材图片的 Storage Bucket：

1. 进入 Supabase Dashboard
2. 选择 **Storage**
3. 点击 **Create a new bucket**
4. 填写信息：
   - Name: `food-images`
   - Public bucket: ✅ 勾选（允许公开访问）
5. 点击 **Create bucket**

### 配置存储策略

在 **Storage** → **Policies** 中添加以下策略：

**允许认证用户上传**：
```sql
CREATE POLICY "Allow authenticated users to upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'food-images');
```

**允许所有人查看**：
```sql
CREATE POLICY "Allow public to view"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'food-images');
```

---

## 🔐 认证配置

### 邮箱认证

项目使用邮箱格式的用户名进行认证（实际上是用户名 + `@freshguard.com`）。

Supabase 认证已经在代码中配置好了，您不需要额外设置。

### 首位用户自动成为管理员

代码中已经实现了首位注册用户自动成为管理员的逻辑。

---

## 🔧 代码中的 Supabase 使用

### 1. 数据查询

```typescript
// 获取用户的食材列表
const { data, error } = await supabase
  .from('food_items')
  .select('*')
  .eq('user_id', userId)
  .order('expiry_date', { ascending: true });
```

### 2. 数据插入

```typescript
// 添加新食材
const { data, error } = await supabase
  .from('food_items')
  .insert({
    user_id: userId,
    name: '苹果',
    category: 'fruits',
    expiry_date: '2025-12-31',
    // ...
  });
```

### 3. 文件上传

```typescript
// 上传图片
const { data, error } = await supabase.storage
  .from('food-images')
  .upload(`${userId}/${fileName}`, file);

// 获取公开URL
const { data: urlData } = supabase.storage
  .from('food-images')
  .getPublicUrl(filePath);
```

### 4. 用户认证

```typescript
// 注册
const { data, error } = await supabase.auth.signUp({
  email: `${username}@freshguard.com`,
  password: password,
});

// 登录
const { data, error } = await supabase.auth.signInWithPassword({
  email: `${username}@freshguard.com`,
  password: password,
});
```

---

## 📦 相关依赖

项目已经安装了必要的 Supabase 依赖：

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x.x"
  }
}
```

---

## 🚀 快速开始

### 完整的设置流程

**步骤 1：创建 Supabase 项目**
1. 访问 https://supabase.com/
2. 创建新项目
3. 记录 Project URL 和 anon key

**步骤 2：配置环境变量**
```bash
# 创建 .env.local 文件
cat > .env.local << EOF
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
EOF
```

**步骤 3：初始化数据库**
```bash
# 使用 Supabase CLI
supabase link --project-ref your-project-id
supabase db push

# 或者在 Dashboard 的 SQL Editor 中手动执行迁移文件
```

**步骤 4：创建 Storage Bucket**
1. 在 Dashboard 中创建 `food-images` bucket
2. 设置为 public
3. 添加存储策略

**步骤 5：启动应用**
```bash
npm run dev
```

**步骤 6：测试**
1. 打开应用
2. 注册第一个用户（自动成为管理员）
3. 添加食材测试功能

---

## 🔍 常见问题

### Q1: 我必须使用 Supabase 吗？

**A**: 是的，项目的后端完全依赖 Supabase。如果您想使用其他后端，需要大量修改代码。

### Q2: Supabase 是免费的吗？

**A**: Supabase 提供免费套餐，包括：
- 500MB 数据库存储
- 1GB 文件存储
- 50,000 月活跃用户
- 2GB 带宽

对于个人项目和小型应用完全够用。

### Q3: 如何备份数据？

**A**: 在 Supabase Dashboard 中：
1. 进入 **Database** → **Backups**
2. 点击 **Download** 下载备份

或使用 CLI：
```bash
supabase db dump -f backup.sql
```

### Q4: 如何查看数据库内容？

**A**: 在 Supabase Dashboard 中：
1. 进入 **Table Editor**
2. 选择要查看的表
3. 可以直接查看、编辑、删除数据

### Q5: 环境变量配置错误怎么办？

**A**: 检查以下几点：
1. `.env.local` 文件是否在项目根目录
2. 变量名是否正确（必须以 `VITE_` 开头）
3. URL 和 Key 是否正确（从 Dashboard 复制）
4. 重启开发服务器（`npm run dev`）

### Q6: 数据库迁移失败怎么办？

**A**: 
1. 检查 Supabase 项目是否正常运行
2. 检查网络连接
3. 尝试手动在 SQL Editor 中执行迁移文件
4. 查看错误信息，可能是表已存在或权限问题

---

## 📚 相关资源

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase JavaScript 客户端文档](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase CLI 文档](https://supabase.com/docs/reference/cli/introduction)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)

---

## 💡 最佳实践

### 1. 环境变量管理
- 开发环境使用 `.env.local`
- 生产环境在部署平台配置
- 不要将 `.env.local` 提交到 Git

### 2. 数据库设计
- 使用 UUID 作为主键
- 设置合适的索引提高查询性能
- 使用外键约束保证数据完整性

### 3. 安全策略
- 启用 RLS（Row Level Security）
- 为每个表设置合适的访问策略
- 不要在客户端暴露敏感信息

### 4. 文件存储
- 限制上传文件大小（建议 1MB）
- 使用合适的文件命名规则
- 定期清理未使用的文件

### 5. 性能优化
- 使用 `.select()` 只查询需要的字段
- 使用 `.limit()` 限制返回数量
- 使用 `.order()` 配合 `.limit()` 实现分页

---

## 🎉 总结

**是的，项目自带 Supabase 集成！**

您只需要：
1. ✅ 创建一个 Supabase 项目（免费）
2. ✅ 配置两个环境变量
3. ✅ 运行数据库迁移
4. ✅ 创建 Storage Bucket
5. ✅ 启动应用

所有的后端逻辑、数据库架构、认证系统都已经在代码中实现好了，您不需要编写任何后端代码！

---

**文档版本**: v1.0  
**最后更新**: 2025-11-19  
**维护者**: FreshGuard 开发团队
