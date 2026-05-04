# 快速开始 - Supabase 配置

## ✅ 是的，项目已集成 Supabase！

时鲜管家应用使用 Supabase 作为后端服务，所有后端代码都已经写好了。

您只需要配置 Supabase 项目即可使用。

---

## 🚀 5 分钟快速配置

### 步骤 1：创建 Supabase 项目（2 分钟）

1. 访问 https://supabase.com/
2. 点击 **Start your project**
3. 使用 GitHub 登录
4. 点击 **New Project**
5. 填写：
   - Name: `freshguard`
   - Database Password: 设置密码（记住它！）
   - Region: `Northeast Asia (Tokyo)` 或离您最近的区域
6. 点击 **Create new project**
7. 等待 2 分钟...

### 步骤 2：获取配置信息（30 秒）

1. 项目创建完成后，进入 **Settings** → **API**
2. 复制两个值：
   - **Project URL** （类似：`https://xxxxx.supabase.co`）
   - **anon public** key（一长串字符）

### 步骤 3：配置环境变量（30 秒）

在项目根目录创建 `.env.local` 文件：

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**重要**：将上面的值替换为您在步骤 2 中复制的实际值！

### 步骤 4：初始化数据库（1 分钟）

**方式 A：使用 SQL Editor（推荐，简单）**

1. 在 Supabase Dashboard 中，进入 **SQL Editor**
2. 点击 **New query**
3. 复制 `supabase/migrations/01_create_initial_schema.sql` 的内容
4. 粘贴到编辑器
5. 点击 **Run** 执行
6. 重复步骤 2-5，依次执行：
   - `02_add_phone_to_profiles.sql`
   - `03_add_storage_method_to_food_items.sql`

**方式 B：使用 CLI（高级）**

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 链接项目
supabase link --project-ref your-project-id

# 应用迁移
supabase db push
```

### 步骤 5：创建图片存储桶（1 分钟）

1. 在 Supabase Dashboard 中，进入 **Storage**
2. 点击 **Create a new bucket**
3. 填写：
   - Name: `food-images`
   - Public bucket: ✅ **勾选**
4. 点击 **Create bucket**
5. 点击刚创建的 `food-images` bucket
6. 进入 **Policies** 标签
7. 点击 **New Policy** → **For full customization**
8. 添加两个策略：

**策略 1：允许认证用户上传**
```sql
CREATE POLICY "Allow authenticated users to upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'food-images');
```

**策略 2：允许所有人查看**
```sql
CREATE POLICY "Allow public to view"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'food-images');
```

### 步骤 6：启动应用！

```bash
npm run dev
```

打开浏览器访问 http://localhost:5173

---

## 🎉 完成！

现在您可以：
- ✅ 注册用户（第一个用户自动成为管理员）
- ✅ 添加食材
- ✅ 上传图片
- ✅ 设置提醒
- ✅ 使用所有功能

---

## 📊 项目中的 Supabase 使用

### 已实现的功能

1. **用户认证**
   - 注册/登录
   - 用户信息管理
   - 角色权限（admin/user）

2. **食材管理**
   - 添加/编辑/删除食材
   - 图片上传
   - 分类管理
   - 保质期计算

3. **提醒系统**
   - 自动生成提醒
   - 提醒消息管理
   - 已读/未读状态

4. **文件存储**
   - 图片上传
   - 图片预览
   - 公开访问

### 代码位置

- **Supabase 客户端**: `src/db/supabase.ts`
- **API 封装**: `src/db/api.ts`
- **认证逻辑**: `src/components/auth/AuthProvider.tsx`
- **文件上传**: `src/hooks/use-supabase-upload.ts`
- **数据库迁移**: `supabase/migrations/`

---

## 🔍 验证配置

### 检查环境变量

```bash
# 查看 .env.local 文件
cat .env.local

# 应该看到：
# VITE_SUPABASE_URL=https://xxxxx.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### 检查数据库

在 Supabase Dashboard 中：
1. 进入 **Table Editor**
2. 应该看到以下表：
   - `profiles`
   - `food_items`
   - `reminders`

### 检查存储桶

在 Supabase Dashboard 中：
1. 进入 **Storage**
2. 应该看到 `food-images` bucket
3. 状态应该是 **Public**

---

## ❓ 常见问题

### Q: 启动时报错 "缺少 Supabase 环境变量"

**A**: 检查 `.env.local` 文件：
- 文件是否在项目根目录？
- 变量名是否正确？（必须以 `VITE_` 开头）
- 重启开发服务器

### Q: 注册时报错

**A**: 检查：
- 数据库迁移是否执行成功？
- 在 Table Editor 中查看 `profiles` 表是否存在

### Q: 图片上传失败

**A**: 检查：
- Storage bucket 是否创建？
- Bucket 是否设置为 Public？
- 存储策略是否添加？

### Q: Supabase 是免费的吗？

**A**: 是的！免费套餐包括：
- 500MB 数据库
- 1GB 文件存储
- 50,000 月活跃用户

对于个人项目完全够用。

---

## 📚 更多信息

- 详细的 Supabase 说明：查看 `SUPABASE_GUIDE.md`
- Supabase 官方文档：https://supabase.com/docs
- 遇到问题？查看 Supabase Dashboard 的 Logs 标签

---

## 💡 提示

1. **不要分享您的环境变量**
   - `.env.local` 已在 `.gitignore` 中
   - 不要将密钥提交到 Git

2. **备份数据库密码**
   - 创建项目时设置的密码很重要
   - 如果忘记，需要重置

3. **定期备份**
   - 在 Dashboard → Database → Backups 中下载备份

4. **监控使用量**
   - 在 Dashboard → Settings → Usage 中查看

---

**配置时间**: 约 5 分钟  
**难度**: ⭐⭐☆☆☆（简单）  
**文档版本**: v1.0
