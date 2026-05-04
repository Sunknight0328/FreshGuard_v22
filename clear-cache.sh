#!/bin/bash

# 时鲜管家 - 清除缓存脚本
# 用于解决浏览器缓存导致的运行时错误

echo "🧹 开始清除缓存..."

# 清除 Vite 缓存
if [ -d "node_modules/.vite" ]; then
  echo "📦 清除 Vite 缓存..."
  rm -rf node_modules/.vite
  echo "✅ Vite 缓存已清除"
fi

# 清除构建输出
if [ -d "dist" ]; then
  echo "📦 清除构建输出..."
  rm -rf dist
  echo "✅ 构建输出已清除"
fi

# 清除 TypeScript 缓存
if [ -f "tsconfig.tsbuildinfo" ]; then
  echo "📦 清除 TypeScript 缓存..."
  rm -f tsconfig.tsbuildinfo
  echo "✅ TypeScript 缓存已清除"
fi

echo ""
echo "✨ 缓存清除完成！"
echo ""
echo "📝 下一步操作："
echo "1. 重启开发服务器: pnpm run dev"
echo "2. 在浏览器中硬刷新: Ctrl+Shift+R (Windows/Linux) 或 Cmd+Shift+R (Mac)"
echo ""
echo "💡 如果问题仍然存在，请查看 TROUBLESHOOTING.md 文件"
