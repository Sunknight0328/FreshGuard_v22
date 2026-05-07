# 🚀 快速修复指南

## 遇到 "handleRecommendShelfLife is not defined" 错误？

### ⚡ 最快解决方案（30秒）

**在浏览器中按以下快捷键：**

```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

**就这么简单！** 🎉

---

## 为什么会出现这个错误？

❌ **不是代码错误**  
✅ **是浏览器缓存问题**

浏览器使用了旧版本的代码，而新功能已经添加到代码中了。

---

## 如果硬刷新不起作用？

### 方案2：清除服务器缓存（1分钟）

```bash
# 运行清理脚本
./clear-cache.sh

# 然后在浏览器中硬刷新
# Ctrl + Shift + R (Windows/Linux)
# Cmd + Shift + R (Mac)
```

### 方案3：完全重启（2分钟）

```bash
# 1. 停止开发服务器 (Ctrl + C)

# 2. 清除缓存
rm -rf node_modules/.vite dist

# 3. 重启服务器
pnpm run dev

# 4. 在浏览器中硬刷新
```

---

## 验证修复成功

1. 打开"添加食材"页面
2. 输入食材名称（如"西红柿"）
3. 点击"智能推荐"按钮
4. 看到"AI查询中..."
5. 看到"保质期推荐成功"

✅ **成功！**

---

## 需要更多帮助？

📖 **详细指南**：查看 `ERROR_FIX_GUIDE.md`  
🔧 **故障排除**：查看 `TROUBLESHOOTING.md`  
📝 **功能说明**：查看 `AI_SHELF_LIFE_FEATURE.md`

---

## 预防措施

**开发时的好习惯：**

1. ✅ 每次更新代码后硬刷新浏览器
2. ✅ 打开开发者工具并禁用缓存
3. ✅ 定期运行 `./clear-cache.sh`
4. ✅ 遇到奇怪问题先硬刷新

**禁用浏览器缓存（开发时）：**
1. 按 `F12` 打开开发者工具
2. 按 `F1` 打开设置
3. 勾选 "Disable cache (while DevTools is open)"
4. 保持开发者工具打开

---

## 记住这个魔法快捷键 ✨

```
Ctrl + Shift + R  (Windows/Linux)
Cmd + Shift + R   (Mac)
```

**90%的缓存问题都能用这个解决！**

---

**时鲜管家** - 让食材管理更智能 💚
