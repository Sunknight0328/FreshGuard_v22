# 构建和部署指南 - 修复 UI 丢失问题

## 🔍 问题诊断

如果导出的包中 UI 元素丢失，通常是以下原因之一：

### 常见原因
1. ❌ **CSS 文件未正确加载** - Tailwind CSS 未编译或路径错误
2. ❌ **静态资源路径错误** - 图片、字体等资源 404
3. ❌ **JavaScript 文件加载失败** - 组件代码未正确打包
4. ❌ **base 路径配置错误** - 资源引用路径不正确
5. ❌ **PostCSS 配置问题** - Tailwind 未正确处理

---

## ✅ 已修复的配置

### 1. index.html
已添加必要的 meta 标签和 title：

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta name="theme-color" content="#22c55e" />
    <title>时鲜管家 - FreshGuard</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 2. vite.config.ts
已添加完整的构建配置：

```typescript
export default defineConfig({
  plugins: [react(), svgr(), miaodaDevPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
});
```

---

## 🚀 正确的构建步骤

### 步骤 1：清理旧的构建文件
```bash
# 删除旧的 dist 目录
rm -rf dist

# 清理 node_modules 缓存（可选，如果问题持续）
rm -rf node_modules/.vite
```

### 步骤 2：确保依赖正确安装
```bash
# 重新安装依赖
pnpm install

# 或者清理后重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 步骤 3：运行构建
```bash
npm run build
```

### 步骤 4：验证构建输出
```bash
# 检查 dist 目录结构
ls -la dist/

# 应该看到以下文件：
# - index.html
# - assets/ (包含 CSS 和 JS 文件)
# - favicon.png
```

### 步骤 5：本地预览（重要！）
```bash
# 使用 Vite 预览构建结果
npm run preview

# 或者使用简单的 HTTP 服务器
npx serve dist
```

在浏览器中打开预览地址，检查：
- ✅ 页面是否正常显示
- ✅ 样式是否正确加载
- ✅ 交互功能是否正常
- ✅ 控制台是否有错误

---

## 🔧 常见问题排查

### 问题 1：页面空白，控制台报错 "Failed to load module"

**原因**：资源路径错误

**解决方案**：
检查 `dist/index.html` 中的资源引用：

```html
<!-- ✅ 正确 - 使用绝对路径 -->
<script type="module" src="/assets/index-abc123.js"></script>
<link rel="stylesheet" href="/assets/index-def456.css">

<!-- ❌ 错误 - 路径不正确 -->
<script type="module" src="assets/index-abc123.js"></script>
```

如果部署到子目录，需要在 `vite.config.ts` 中设置 `base`：
```typescript
export default defineConfig({
  base: '/your-subdirectory/', // 例如：'/freshguard/'
  // ...
});
```

### 问题 2：样式丢失，页面显示但没有样式

**原因**：Tailwind CSS 未正确编译

**解决方案**：

1. 检查 `src/index.css` 是否包含 Tailwind 指令：
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

2. 检查 `src/main.tsx` 是否导入了 CSS：
```typescript
import './index.css';
```

3. 检查 `postcss.config.js`：
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

4. 检查 `tailwind.config.mjs`：
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
}
```

### 问题 3：shadcn/ui 组件不显示

**原因**：组件样式未正确打包

**解决方案**：

1. 确保所有 shadcn/ui 组件都正确导入：
```typescript
import { Button } from '@/components/ui/button';
```

2. 检查 `components.json` 配置：
```json
{
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.mjs",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### 问题 4：图标不显示

**原因**：lucide-react 图标未正确打包

**解决方案**：

确保图标正确导入：
```typescript
import { Leaf, Globe, Settings } from 'lucide-react';
```

### 问题 5：字体加载失败

**原因**：字体文件路径错误或未包含

**解决方案**：

1. 如果使用自定义字体，确保字体文件在 `public` 目录
2. 在 CSS 中使用正确的路径：
```css
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom-font.woff2') format('woff2');
}
```

---

## 📦 部署到不同平台

### 部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel

# 或者直接部署到生产环境
vercel --prod
```

**vercel.json** 配置（可选）：
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### 部署到 Netlify

```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 部署
netlify deploy

# 部署到生产环境
netlify deploy --prod
```

**netlify.toml** 配置：
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 部署到静态服务器（Nginx）

**nginx.conf** 配置：
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/freshguard/dist;
    index index.html;

    # 处理 SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 缓存静态资源
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

### 部署到 Apache

**.htaccess** 配置：
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# 启用 Gzip 压缩
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>

# 设置缓存
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
</IfModule>
```

---

## 🔍 调试技巧

### 1. 使用浏览器开发者工具

**检查网络请求**：
- 打开 DevTools → Network 标签
- 刷新页面
- 查看是否有 404 错误
- 检查 CSS 和 JS 文件是否正确加载

**检查控制台错误**：
- 打开 DevTools → Console 标签
- 查看是否有 JavaScript 错误
- 特别注意模块加载错误

**检查元素样式**：
- 打开 DevTools → Elements 标签
- 选择一个元素
- 查看 Styles 面板，确认 Tailwind 类是否生效

### 2. 检查构建输出

```bash
# 查看 dist 目录结构
tree dist/

# 应该看到类似这样的结构：
# dist/
# ├── index.html
# ├── favicon.png
# └── assets/
#     ├── index-abc123.js
#     ├── index-def456.css
#     └── vendor-ghi789.js
```

### 3. 检查文件大小

```bash
# 查看文件大小
du -h dist/assets/*

# CSS 文件应该有合理的大小（通常 50-200KB）
# JS 文件大小取决于应用复杂度
```

### 4. 验证 CSS 内容

```bash
# 查看 CSS 文件内容
cat dist/assets/index-*.css | head -50

# 应该看到 Tailwind 的样式定义
# 例如：.bg-primary, .text-foreground 等
```

---

## 📋 构建检查清单

在部署前，请确认以下项目：

### 配置文件
- [ ] `vite.config.ts` 包含完整的 build 配置
- [ ] `tailwind.config.mjs` 的 content 路径正确
- [ ] `postcss.config.js` 包含 tailwindcss 和 autoprefixer
- [ ] `index.html` 包含正确的 meta 标签和 title

### 源代码
- [ ] `src/main.tsx` 导入了 `./index.css`
- [ ] `src/index.css` 包含 Tailwind 指令
- [ ] 所有组件正确导入（使用 @ 别名）
- [ ] 所有图标正确导入（lucide-react）

### 构建输出
- [ ] `dist/index.html` 存在且包含正确的资源引用
- [ ] `dist/assets/` 目录包含 CSS 和 JS 文件
- [ ] CSS 文件大小合理（不是 0 字节）
- [ ] JS 文件正确打包（不是空文件）

### 功能测试
- [ ] 本地预览正常显示
- [ ] 样式正确加载
- [ ] 交互功能正常
- [ ] 路由跳转正常
- [ ] 图片和图标正常显示
- [ ] 控制台无错误

---

## 🆘 仍然有问题？

如果按照上述步骤操作后仍然有问题，请提供以下信息：

1. **构建输出**：
```bash
npm run build 2>&1 | tee build.log
```

2. **dist 目录结构**：
```bash
tree dist/ > dist-structure.txt
```

3. **浏览器控制台错误**：
- 截图或复制完整的错误信息

4. **网络请求**：
- DevTools → Network 标签的截图
- 特别是 404 或失败的请求

5. **部署环境**：
- 部署到哪个平台？（Vercel、Netlify、自己的服务器等）
- 是否部署到子目录？
- 使用的域名或 URL

---

## 💡 最佳实践

### 1. 使用环境变量
创建 `.env.production` 文件：
```env
VITE_APP_TITLE=时鲜管家
VITE_API_URL=https://your-api-domain.com
```

### 2. 优化构建大小
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
});
```

### 3. 启用压缩
大多数现代服务器都支持 Gzip 或 Brotli 压缩，确保启用。

### 4. 设置正确的缓存策略
- HTML 文件：不缓存或短时间缓存
- CSS/JS 文件：长时间缓存（文件名包含 hash）
- 图片/字体：长时间缓存

---

## 📚 相关资源

- [Vite 构建文档](https://vitejs.dev/guide/build.html)
- [Tailwind CSS 生产环境优化](https://tailwindcss.com/docs/optimizing-for-production)
- [shadcn/ui 文档](https://ui.shadcn.com/)
- [React Router 部署指南](https://reactrouter.com/en/main/guides/deploying)

---

**文档版本**: v1.0  
**最后更新**: 2025-11-19  
**维护者**: FreshGuard 开发团队
