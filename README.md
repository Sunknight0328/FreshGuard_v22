# 时鲜管家 / FreshKeeper

<div align="center">

![Version](https://img.shields.io/badge/version-1.2.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178c6.svg)

**一款智能食材保质期管理应用**

[简体中文](#简体中文) | [English](#english)

</div>

---

# 简体中文

## 📖 项目介绍

时鲜管家是一款智能食材保质期管理Web应用，通过AI技术和OCR识别，帮助用户轻松管理食材，在保质期临近时智能提醒，有效减少食物浪费，倡导环保生活方式。

### ✨ 核心特性

- 🤖 **AI智能推荐**：自动推荐食材保质期，无需手动输入
- 📸 **OCR小票识别**：拍照识别购物小票，快速录入食材
- 📱 **移动优先设计**：完美适配手机、平板和桌面设备
- ⏰ **智能提醒系统**：提前3天和1天提醒即将过期的食材
- 🌍 **多语言支持**：支持中文和英文界面切换
- 🎨 **清新界面设计**：绿色主题，简洁美观
- 📊 **数据统计分析**：查看食材使用情况和浪费统计
- 👥 **多用户管理**：支持用户注册登录和权限管理

### 🎯 主要功能

#### 1. 食材管理
- ✅ 添加食材（手动输入或扫描小票）
- ✅ 编辑食材信息
- ✅ 删除食材
- ✅ 查看食材详情
- ✅ 搜索和筛选食材
- ✅ 按分类管理食材

#### 2. 智能识别
- ✅ OCR小票识别
- ✅ 自动提取商品名称
- ✅ AI智能推荐保质期
- ✅ 图片上传和拍照

#### 3. 提醒中心
- ✅ 即将过期食材列表
- ✅ 准确的到期天数显示
- ✅ 提醒历史记录
- ✅ 一键查看食材详情

#### 4. 用户系统
- ✅ 邮箱注册和登录
- ✅ 注册时确认密码（两次输入）
- ✅ 邮箱验证码验证
- ✅ 忘记密码（邮件重置）
- ✅ 个人资料管理
- ✅ 管理员后台
- ✅ 权限控制

## 📁 目录结构

```
时鲜管家/
├── README.md                      # 项目说明文档
├── README_EN.md                   # 英文说明文档
├── package.json                   # 项目依赖配置
├── tsconfig.json                  # TypeScript配置
├── vite.config.ts                 # Vite构建配置
├── tailwind.config.ts             # Tailwind CSS配置
├── components.json                # shadcn/ui组件配置
├── eslint.config.js               # ESLint代码检查配置
├── postcss.config.js              # PostCSS配置
├── index.html                     # HTML入口文件
│
├── public/                        # 静态资源目录
│   ├── favicon.png                # 网站图标
│   └── images/                    # 图片资源
│
├── src/                           # 源代码目录
│   ├── main.tsx                   # 应用入口文件
│   ├── App.tsx                    # 根组件
│   ├── index.css                  # 全局样式
│   ├── routes.tsx                 # 路由配置
│   │
│   ├── components/                # 组件目录
│   │   ├── ui/                    # UI基础组件（shadcn/ui）
│   │   │   ├── button.tsx         # 按钮组件
│   │   │   ├── card.tsx           # 卡片组件
│   │   │   ├── input.tsx          # 输入框组件
│   │   │   ├── dialog.tsx         # 对话框组件
│   │   │   ├── toast.tsx          # 提示组件
│   │   │   ├── skeleton.tsx       # 骨架屏组件
│   │   │   └── ...                # 其他UI组件
│   │   │
│   │   └── common/                # 通用业务组件
│   │       ├── Header.tsx         # 页面头部
│   │       ├── Footer.tsx         # 页面底部
│   │       ├── BottomNav.tsx      # 底部导航栏
│   │       └── ...                # 其他通用组件
│   │
│   ├── pages/                     # 页面目录
│   │   ├── Home.tsx               # 首页（电子冰箱）
│   │   ├── AddFood.tsx            # 添加食材页面
│   │   ├── FoodDetail.tsx         # 食材详情页面
│   │   ├── Reminders.tsx          # 提醒中心页面
│   │   ├── Profile.tsx            # 个人中心页面
│   │   ├── Login.tsx              # 登录页面
│   │   ├── Register.tsx           # 注册页面
│   │   ├── AdminDashboard.tsx     # 管理员仪表板
│   │   └── UserManagement.tsx     # 用户管理页面
│   │
│   ├── context/                   # React Context
│   │   └── AuthContext.tsx        # 认证上下文
│   │
│   ├── db/                        # 数据库相关
│   │   ├── supabase.ts            # Supabase客户端
│   │   └── api.ts                 # 数据库API封装
│   │
│   ├── utils/                     # 工具函数
│   │   ├── api.ts                 # 第三方API调用
│   │   └── shelfLifeHelper.ts     # 保质期辅助函数
│   │
│   ├── hooks/                     # 自定义Hooks
│   │   └── use-toast.ts           # Toast提示Hook
│   │
│   ├── lib/                       # 工具库
│   │   └── utils.ts               # 通用工具函数
│   │
│   ├── i18n/                      # 国际化
│   │   ├── index.ts               # i18n配置
│   │   └── locales/               # 语言文件
│   │       ├── zh.json            # 中文
│   │       └── en.json            # 英文
│   │
│   └── types/                     # 类型定义
│       └── types.ts               # TypeScript类型定义
│
├── supabase/                      # Supabase配置
│   └── migrations/                # 数据库迁移文件
│       ├── 01_initial_schema.sql  # 初始数据库结构
│       └── ...                    # 其他迁移文件
│
├── docs/                          # 文档目录（虚拟目录，实际在根目录）
│   ├── UPDATE_LOG.md              # 更新日志
│   ├── USER_GUIDE.md              # 用户指南
│   ├── TROUBLESHOOTING.md         # 故障排除
│   ├── NEW_FEATURES_GUIDE.md      # 新功能指南
│   ├── FIXES_SUMMARY.md           # 修复总结
│   ├── RELEASE_NOTES.md           # 版本发布说明
│   └── ...                        # 其他文档
│
└── .env                           # 环境变量配置（需自行创建）
```

## 🛠️ 技术栈

### 前端技术
- **框架**: React 18.3.1
- **语言**: TypeScript 5.6.2
- **构建工具**: Vite 6.0.1
- **样式**: Tailwind CSS 3.4.17
- **UI组件**: shadcn/ui
- **路由**: React Router 7.1.1
- **国际化**: i18next 24.2.0
- **HTTP客户端**: Axios 1.7.9

### 后端技术
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **存储**: Supabase Storage
- **实时功能**: Supabase Realtime

### AI集成
- **OCR识别**: 百度图像内容理解API
- **保质期推荐**: 百度文心大模型API
- **知识查询**: 百度百科API

## 🚀 快速开始

### 环境要求

```bash
Node.js >= 20.0.0
npm >= 10.0.0
```

### 安装步骤

#### 1. 克隆或下载项目

```bash
# 下载代码包并解压
# 或使用git克隆（如果有仓库地址）
git clone <repository-url>
cd app-7noqonmn18g1
```

#### 2. 安装依赖

```bash
npm install
# 或使用 pnpm
pnpm install
```

#### 3. 配置环境变量

创建 `.env.local` 文件并配置以下变量：

```env
# Supabase配置（必需）
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 应用ID
VITE_APP_ID=app-7noqonmn18g1

# API环境
VITE_API_ENV=production
```

> 📚 **Supabase 配置指南**：
> - 🚀 快速开始：查看 [SUPABASE_QUICKSTART.md](./SUPABASE_QUICKSTART.md)（5分钟配置）
> - 📖 完整文档：查看 [SUPABASE_GUIDE.md](./SUPABASE_GUIDE.md)（详细说明）
> - 📋 简要说明：查看 [SUPABASE_SUMMARY.md](./SUPABASE_SUMMARY.md)（快速了解）

> 📧 **邮箱验证配置**：
> - 🚀 快速开始：查看 [QUICK_START_EMAIL.md](./QUICK_START_EMAIL.md)（3分钟配置）
> - 📧 QQ邮箱配置：查看 [QQ_EMAIL_SMTP_CONFIG.md](./QQ_EMAIL_SMTP_CONFIG.md)（详细指南）
> - 📖 完整文档：查看 [EMAIL_VERIFICATION_GUIDE.md](./EMAIL_VERIFICATION_GUIDE.md)（通用指南）

#### 4. 启动开发服务器

```bash
npm run dev
# 或指定主机
npm run dev -- --host 127.0.0.1
```

访问 `http://localhost:5173` 查看应用

#### 5. 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录

## 📱 使用指南

### 快速添加食材

1. 点击底部导航栏的"添加"按钮
2. 输入食材名称（例如："西红柿"）
3. 选择分类（例如："蔬菜"）
4. 点击"添加食材"按钮
5. 系统自动推荐保质期
6. 完成！

### 扫描小票添加

1. 点击"添加食材"
2. 切换到"扫描小票"标签
3. 点击"拍照"或"上传图片"
4. 选择小票图片
5. 点击"扫描小票"
6. 等待识别完成
7. 确认并提交

### 查看提醒

1. 点击底部导航栏的"提醒"按钮
2. 查看即将过期的食材列表
3. 点击食材查看详情或编辑

## 🔧 开发指南

### 项目结构说明

- **src/components/ui**: shadcn/ui基础组件，不建议修改
- **src/components/common**: 通用业务组件，可根据需求修改
- **src/pages**: 页面组件，主要业务逻辑所在
- **src/db**: 数据库相关代码，包含Supabase客户端和API封装
- **src/utils**: 工具函数，包含第三方API调用等
- **src/i18n**: 国际化配置和语言文件

### 添加新页面

1. 在 `src/pages` 目录创建新页面组件
2. 在 `src/routes.tsx` 添加路由配置
3. 在 `src/components/common/Header.tsx` 或 `BottomNav.tsx` 添加导航链接

### 添加新的API调用

1. 在 `src/utils/api.ts` 添加API方法
2. 在页面组件中导入并使用

### 数据库操作

1. 在 `src/db/api.ts` 添加数据库操作函数
2. 使用 Supabase 客户端进行CRUD操作
3. 确保正确处理错误和返回值

### 代码规范

```bash
# 运行代码检查
npm run lint

# 自动修复代码问题
npm run lint -- --fix
```

### 国际化检查

```bash
# 检查英文翻译纯度（确保没有中文字符）
python3 check_i18n.py
```

**检查内容**：
- ✅ 英文翻译纯度（en.json 中不能有中文）
- ✅ JSON 文件格式正确性
- ✅ 中英文翻译键一致性

## 🌍 国际化

### 添加新语言

1. 在 `src/i18n/locales` 目录创建新的语言文件（如 `ja.json`）
2. 复制 `zh.json` 的结构并翻译
3. 在 `src/i18n/index.ts` 导入新语言文件
4. 在语言切换器中添加新选项

### 使用翻译

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return <div>{t('common.welcome')}</div>;
}
```

## 📚 文档

- [更新日志](./UPDATE_LOG.md) - 查看版本更新历史
- [用户指南](./USER_GUIDE.md) - 详细的使用说明
- [新功能指南](./NEW_FEATURES_GUIDE.md) - 最新功能介绍
- [故障排除](./TROUBLESHOOTING.md) - 常见问题解决
- [修复总结](./FIXES_SUMMARY.md) - Bug修复记录
- [版本发布说明](./RELEASE_NOTES.md) - 版本发布信息

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

### 报告问题

如果您发现bug或有功能建议，请创建Issue并提供：
- 问题描述
- 复现步骤
- 预期行为
- 实际行为
- 环境信息（浏览器、操作系统等）

### 提交代码

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [React](https://reactjs.org/) - UI框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [shadcn/ui](https://ui.shadcn.com/) - UI组件库
- [Supabase](https://supabase.com/) - 后端服务
- [百度AI](https://ai.baidu.com/) - AI服务

## 📞 联系方式

如有问题或建议，欢迎联系！

---

**时鲜管家** - 让食材管理更智能，让生活更环保 🌱

---

# English

## 📖 Project Introduction

FreshKeeper is an intelligent food shelf-life management web application that helps users easily manage food ingredients through AI technology and OCR recognition. It provides smart reminders when expiration dates approach, effectively reducing food waste and promoting an eco-friendly lifestyle.

### ✨ Core Features

- 🤖 **AI Smart Recommendations**: Automatically recommend shelf life without manual input
- 📸 **OCR Receipt Recognition**: Scan shopping receipts to quickly add ingredients
- 📱 **Mobile-First Design**: Perfect adaptation for phones, tablets, and desktops
- ⏰ **Smart Reminder System**: Remind 3 days and 1 day before expiration
- 🌍 **Multi-language Support**: Support Chinese and English interface switching
- 🎨 **Fresh Interface Design**: Green theme, clean and beautiful
- 📊 **Data Statistics**: View ingredient usage and waste statistics
- 👥 **Multi-user Management**: Support user registration, login, and permission management

### 🎯 Main Functions

#### 1. Ingredient Management
- ✅ Add ingredients (manual input or scan receipt)
- ✅ Edit ingredient information
- ✅ Delete ingredients
- ✅ View ingredient details
- ✅ Search and filter ingredients
- ✅ Manage by category

#### 2. Smart Recognition
- ✅ OCR receipt recognition
- ✅ Auto-extract product names
- ✅ AI smart shelf-life recommendation
- ✅ Image upload and camera capture

#### 3. Reminder Center
- ✅ List of expiring ingredients
- ✅ Accurate expiration countdown
- ✅ Reminder history
- ✅ One-click view details

#### 4. User System
- ✅ Email registration and login
- ✅ Password confirmation (enter twice)
- ✅ Email verification code
- ✅ Forgot password (email reset)
- ✅ Profile management
- ✅ Admin dashboard
- ✅ Permission control
- ✅ Forgot password (email reset)
- ✅ Profile management
- ✅ Admin dashboard
- ✅ Permission control

## 📁 Directory Structure

```
FreshKeeper/
├── README.md                      # Project documentation
├── README_EN.md                   # English documentation
├── package.json                   # Project dependencies
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite build configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── components.json                # shadcn/ui component configuration
├── eslint.config.js               # ESLint configuration
├── postcss.config.js              # PostCSS configuration
├── index.html                     # HTML entry file
│
├── public/                        # Static assets
│   ├── favicon.png                # Website icon
│   └── images/                    # Image resources
│
├── src/                           # Source code directory
│   ├── main.tsx                   # Application entry
│   ├── App.tsx                    # Root component
│   ├── index.css                  # Global styles
│   ├── routes.tsx                 # Route configuration
│   │
│   ├── components/                # Components directory
│   │   ├── ui/                    # UI base components (shadcn/ui)
│   │   │   ├── button.tsx         # Button component
│   │   │   ├── card.tsx           # Card component
│   │   │   ├── input.tsx          # Input component
│   │   │   ├── dialog.tsx         # Dialog component
│   │   │   ├── toast.tsx          # Toast component
│   │   │   ├── skeleton.tsx       # Skeleton component
│   │   │   └── ...                # Other UI components
│   │   │
│   │   └── common/                # Common business components
│   │       ├── Header.tsx         # Page header
│   │       ├── Footer.tsx         # Page footer
│   │       ├── BottomNav.tsx      # Bottom navigation
│   │       └── ...                # Other common components
│   │
│   ├── pages/                     # Pages directory
│   │   ├── Home.tsx               # Home page (Digital Fridge)
│   │   ├── AddFood.tsx            # Add ingredient page
│   │   ├── FoodDetail.tsx         # Ingredient detail page
│   │   ├── Reminders.tsx          # Reminder center page
│   │   ├── Profile.tsx            # Profile page
│   │   ├── Login.tsx              # Login page
│   │   ├── Register.tsx           # Register page
│   │   ├── AdminDashboard.tsx     # Admin dashboard
│   │   └── UserManagement.tsx     # User management page
│   │
│   ├── context/                   # React Context
│   │   └── AuthContext.tsx        # Authentication context
│   │
│   ├── db/                        # Database related
│   │   ├── supabase.ts            # Supabase client
│   │   └── api.ts                 # Database API wrapper
│   │
│   ├── utils/                     # Utility functions
│   │   ├── api.ts                 # Third-party API calls
│   │   └── shelfLifeHelper.ts     # Shelf life helper functions
│   │
│   ├── hooks/                     # Custom Hooks
│   │   └── use-toast.ts           # Toast hook
│   │
│   ├── lib/                       # Library
│   │   └── utils.ts               # Common utility functions
│   │
│   ├── i18n/                      # Internationalization
│   │   ├── index.ts               # i18n configuration
│   │   └── locales/               # Language files
│   │       ├── zh.json            # Chinese
│   │       └── en.json            # English
│   │
│   └── types/                     # Type definitions
│       └── types.ts               # TypeScript type definitions
│
├── supabase/                      # Supabase configuration
│   └── migrations/                # Database migration files
│       ├── 01_initial_schema.sql  # Initial database structure
│       └── ...                    # Other migration files
│
├── docs/                          # Documentation directory (virtual, actually in root)
│   ├── UPDATE_LOG.md              # Update log
│   ├── USER_GUIDE.md              # User guide
│   ├── TROUBLESHOOTING.md         # Troubleshooting
│   ├── NEW_FEATURES_GUIDE.md      # New features guide
│   ├── FIXES_SUMMARY.md           # Fixes summary
│   ├── RELEASE_NOTES.md           # Release notes
│   └── ...                        # Other documents
│
└── .env                           # Environment variables (create yourself)
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3.1
- **Language**: TypeScript 5.6.2
- **Build Tool**: Vite 6.0.1
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: shadcn/ui
- **Routing**: React Router 7.1.1
- **i18n**: i18next 24.2.0
- **HTTP Client**: Axios 1.7.9

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Realtime**: Supabase Realtime

### AI Integration
- **OCR Recognition**: Baidu Image Understanding API
- **Shelf Life Recommendation**: Baidu ERNIE Bot API
- **Knowledge Query**: Baidu Baike API

## 🚀 Quick Start

### Requirements

```bash
Node.js >= 20.0.0
npm >= 10.0.0
```

### Installation

#### 1. Clone or Download Project

```bash
# Download and extract the code package
# Or use git clone (if repository URL available)
git clone <repository-url>
cd app-7noqonmn18g1
```

#### 2. Install Dependencies

```bash
npm install
# or use pnpm
pnpm install
```

#### 3. Configure Environment Variables

Create `.env.local` file and configure the following variables:

```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application ID
VITE_APP_ID=app-7noqonmn18g1

# API Environment
VITE_API_ENV=production
```

> 📚 **Supabase Configuration Guide**:
> - 🚀 Quick Start: See [SUPABASE_QUICKSTART.md](./SUPABASE_QUICKSTART.md) (5-minute setup)
> - 📖 Full Documentation: See [SUPABASE_GUIDE.md](./SUPABASE_GUIDE.md) (detailed guide)
> - 📋 Summary: See [SUPABASE_SUMMARY.md](./SUPABASE_SUMMARY.md) (quick overview)

> 📧 **Email Verification Setup**:
> - 🚀 Quick Start: See [QUICK_START_EMAIL.md](./QUICK_START_EMAIL.md) (3-minute setup)
> - 📧 QQ Email Config: See [QQ_EMAIL_SMTP_CONFIG.md](./QQ_EMAIL_SMTP_CONFIG.md) (detailed guide)
> - 📖 Full Guide: See [EMAIL_VERIFICATION_GUIDE.md](./EMAIL_VERIFICATION_GUIDE.md) (general guide)

#### 4. Start Development Server

```bash
npm run dev
# or specify host
npm run dev -- --host 127.0.0.1
```

Visit `http://localhost:5173` to view the application

#### 5. Build for Production

```bash
npm run build
```

Build output will be generated in the `dist` directory

## 📱 User Guide

### Quick Add Ingredient

1. Click the "Add" button in the bottom navigation
2. Enter ingredient name (e.g., "Tomato")
3. Select category (e.g., "Vegetables")
4. Click "Add Ingredient" button
5. System automatically recommends shelf life
6. Done!

### Scan Receipt to Add

1. Click "Add Ingredient"
2. Switch to "Scan Receipt" tab
3. Click "Take Photo" or "Upload Image"
4. Select receipt image
5. Click "Scan Receipt"
6. Wait for recognition to complete
7. Confirm and submit

### View Reminders

1. Click the "Reminders" button in the bottom navigation
2. View list of expiring ingredients
3. Click ingredient to view details or edit

## 🔧 Development Guide

### Project Structure

- **src/components/ui**: shadcn/ui base components, not recommended to modify
- **src/components/common**: Common business components, can be modified as needed
- **src/pages**: Page components, main business logic
- **src/db**: Database-related code, includes Supabase client and API wrapper
- **src/utils**: Utility functions, includes third-party API calls
- **src/i18n**: Internationalization configuration and language files

### Add New Page

1. Create new page component in `src/pages` directory
2. Add route configuration in `src/routes.tsx`
3. Add navigation link in `src/components/common/Header.tsx` or `BottomNav.tsx`

### Add New API Call

1. Add API method in `src/utils/api.ts`
2. Import and use in page component

### Database Operations

1. Add database operation function in `src/db/api.ts`
2. Use Supabase client for CRUD operations
3. Ensure proper error handling and return values

### Code Standards

```bash
# Run code check
npm run lint

# Auto-fix code issues
npm run lint -- --fix
```

### Internationalization Check

```bash
# Check English translation purity (ensure no Chinese characters)
python3 check_i18n.py
```

**Check Items**:
- ✅ English translation purity (no Chinese in en.json)
- ✅ JSON file format validity
- ✅ Translation key consistency between languages

## 🌍 Internationalization

### Add New Language

1. Create new language file in `src/i18n/locales` directory (e.g., `ja.json`)
2. Copy structure from `zh.json` and translate
3. Import new language file in `src/i18n/index.ts`
4. Add new option in language switcher

### Use Translation

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return <div>{t('common.welcome')}</div>;
}
```

## 📚 Documentation

- [Update Log](./UPDATE_LOG.md) - View version update history
- [User Guide](./USER_GUIDE.md) - Detailed usage instructions
- [New Features Guide](./NEW_FEATURES_GUIDE.md) - Latest features introduction
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues solutions
- [Fixes Summary](./FIXES_SUMMARY.md) - Bug fix records
- [Release Notes](./RELEASE_NOTES.md) - Version release information

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

### Report Issues

If you find a bug or have a feature suggestion, please create an Issue with:
- Problem description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment information (browser, OS, etc.)

### Submit Code

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Framework
- [Vite](https://vitejs.dev/) - Build Tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [shadcn/ui](https://ui.shadcn.com/) - UI Component Library
- [Supabase](https://supabase.com/) - Backend Service
- [Baidu AI](https://ai.baidu.com/) - AI Services

## 📞 Contact

For questions or suggestions, feel free to reach out!

---

**FreshKeeper** - Making food management smarter, making life greener 🌱
