# 语言选择功能说明

## 功能概述

时鲜管家现在支持在应用启动时选择语言，为用户提供更好的国际化体验。

---

## 功能特点

### 1. 首次访问体验
当用户第一次访问应用时，会看到一个精美的语言选择界面：

- 🌍 **双语欢迎**: 应用名称同时显示中英文
- 🇨🇳 🇺🇸 **国旗图标**: 直观的视觉标识
- ✨ **清晰提示**: 双语说明，易于理解
- 🎨 **美观设计**: 符合应用绿色主题的界面风格

### 2. 语言选项
- **中文（简体）**: 🇨🇳 中文
- **English**: 🇺🇸 English

### 3. 选择交互
- 点击语言卡片进行选择
- 选中的语言会高亮显示
- 显示勾选图标确认选择
- 点击"确认"按钮完成设置

### 4. 持久化存储
- 用户的语言选择会保存到浏览器本地存储
- 下次访问时自动加载上次选择的语言
- 无需重复选择

---

## 使用流程

### 首次访问

```
1. 打开应用
   ↓
2. 看到语言选择界面
   ↓
3. 点击选择中文或英文
   ↓
4. 点击"确认"按钮
   ↓
5. 进入应用主界面
```

### 再次访问

```
1. 打开应用
   ↓
2. 自动加载上次选择的语言
   ↓
3. 直接进入应用主界面
```

### 更改语言

```
1. 进入"设置"页面
   ↓
2. 在"语言"选项中选择新语言
   ↓
3. 语言立即切换
   ↓
4. 新选择自动保存
```

---

## 技术实现

### 组件结构

```
LanguageSelector.tsx
├── 语言选项卡片
│   ├── 国旗图标
│   ├── 语言名称
│   ├── 语言描述
│   └── 选中标记
├── 确认按钮
└── 提示文本
```

### 数据流

```
App.tsx
├── 检查 localStorage
│   ├── 有保存的语言 → 加载并进入应用
│   └── 无保存的语言 → 显示语言选择界面
│
└── 用户选择语言
    ├── 更新 i18n 语言设置
    ├── 保存到 localStorage
    └── 进入应用主界面
```

### 存储机制

```javascript
// 保存语言选择
localStorage.setItem('language', 'zh'); // 或 'en'

// 读取语言选择
const savedLanguage = localStorage.getItem('language');

// 应用语言设置
i18n.changeLanguage(savedLanguage);
```

---

## 界面设计

### 视觉元素

1. **背景**
   - 渐变色：从主色调的浅色到背景色
   - 营造温馨、专业的氛围

2. **卡片**
   - 白色背景，圆角设计
   - 阴影效果，增强层次感
   - 响应式布局，适配各种屏幕

3. **图标**
   - 地球图标：代表国际化
   - 国旗图标：直观的语言标识
   - 勾选图标：确认选择状态

4. **颜色**
   - 主色：绿色（符合应用主题）
   - 选中状态：绿色高亮
   - 文字：清晰易读的对比度

### 交互反馈

1. **悬停效果**
   - 鼠标悬停时边框变为主色
   - 背景色轻微变化

2. **选中状态**
   - 边框加粗并变为主色
   - 背景色变为主色的浅色
   - 显示勾选图标
   - 添加阴影效果

3. **按钮状态**
   - 未选择：按钮禁用，灰色显示
   - 已选择：按钮启用，主色显示
   - 点击后：进入应用

---

## 代码示例

### LanguageSelector 组件

```tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Globe, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LanguageSelector({ onLanguageSelected }) {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const handleConfirm = () => {
    if (selectedLanguage) {
      i18n.changeLanguage(selectedLanguage);
      localStorage.setItem('language', selectedLanguage);
      onLanguageSelected(selectedLanguage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card>
        {/* 语言选项 */}
        <button onClick={() => setSelectedLanguage('zh')}>
          🇨🇳 中文
        </button>
        <button onClick={() => setSelectedLanguage('en')}>
          🇺🇸 English
        </button>
        
        {/* 确认按钮 */}
        <Button onClick={handleConfirm} disabled={!selectedLanguage}>
          确认 / Confirm
        </Button>
      </Card>
    </div>
  );
}
```

### App.tsx 集成

```tsx
import { useState, useEffect } from 'react';
import LanguageSelector from '@/components/LanguageSelector';
import { useTranslation } from 'react-i18next';

const App = () => {
  const { i18n } = useTranslation();
  const [languageSelected, setLanguageSelected] = useState(false);

  useEffect(() => {
    // 检查是否已选择语言
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      setLanguageSelected(true);
    }
  }, [i18n]);

  // 显示语言选择界面
  if (!languageSelected) {
    return <LanguageSelector onLanguageSelected={setLanguageSelected} />;
  }

  // 显示正常应用界面
  return <MainApp />;
};
```

---

## 用户体验优化

### 1. 快速加载
- 语言选择界面加载迅速
- 无需等待其他资源

### 2. 清晰引导
- 双语提示，避免语言障碍
- 图标辅助，直观易懂

### 3. 灵活切换
- 首次选择后可随时更改
- 在设置页面提供语言切换选项

### 4. 状态保持
- 语言选择持久化保存
- 刷新页面不会丢失设置

---

## 常见问题

### Q1: 如何重新选择语言？
**A**: 进入"设置"页面，在"语言"选项中选择新的语言即可。

### Q2: 语言选择会保存吗？
**A**: 是的，您的语言选择会保存在浏览器本地存储中，下次访问时自动加载。

### Q3: 清除浏览器数据后会怎样？
**A**: 如果清除了浏览器的本地存储，下次访问时会再次显示语言选择界面。

### Q4: 支持哪些语言？
**A**: 目前支持中文（简体）和英文两种语言。

### Q5: 可以添加更多语言吗？
**A**: 可以。在 `LanguageSelector.tsx` 中添加新的语言选项，并在 `src/i18n/locales/` 目录下添加对应的翻译文件即可。

---

## 扩展建议

### 添加新语言

1. **创建翻译文件**
   ```
   src/i18n/locales/
   ├── zh.json
   ├── en.json
   └── ja.json  // 新增日语
   ```

2. **更新 i18n 配置**
   ```typescript
   import ja from './locales/ja.json';
   
   i18n.init({
     resources: {
       zh: { translation: zh },
       en: { translation: en },
       ja: { translation: ja },  // 添加日语
     },
   });
   ```

3. **添加语言选项**
   ```typescript
   const languages = [
     { code: 'zh', name: '中文', flag: '🇨🇳' },
     { code: 'en', name: 'English', flag: '🇺🇸' },
     { code: 'ja', name: '日本語', flag: '🇯🇵' },  // 新增
   ];
   ```

---

## 总结

语言选择功能为时鲜管家提供了更好的国际化体验：

- ✅ **用户友好**: 首次访问即可选择偏好语言
- ✅ **持久化**: 语言选择自动保存
- ✅ **灵活性**: 随时可在设置中更改
- ✅ **美观**: 符合应用整体设计风格
- ✅ **可扩展**: 易于添加新语言支持

这个功能让应用更加国际化，为不同语言背景的用户提供了更好的使用体验。

---

**文档版本**: v1.0  
**最后更新**: 2025-11-19  
**功能版本**: v1.5.0
