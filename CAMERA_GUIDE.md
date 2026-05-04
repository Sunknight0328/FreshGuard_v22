# 相机功能说明

## 📸 拍照按钮实现

### 当前实现

在"添加食材"和"扫描小票"页面中，都有两个按钮：

1. **📤 上传图片** - 打开图库选择已有照片
2. **📷 拍照** - 直接调用相机拍照

### 技术实现

使用 HTML5 的 `<input type="file">` 元素，通过 `capture` 属性区分：

```tsx
{/* 上传图片按钮 - 打开图库 */}
<input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  onChange={handleFileChange}
  className="hidden"
/>

{/* 拍照按钮 - 直接调用相机 */}
<input
  ref={cameraInputRef}
  type="file"
  accept="image/*"
  capture="environment"  // 关键属性：调用后置摄像头
  onChange={handleFileChange}
  className="hidden"
/>
```

### capture 属性说明

- **`capture="environment"`** - 调用后置摄像头（拍摄环境）
- **`capture="user"`** - 调用前置摄像头（自拍）
- **不设置 `capture`** - 打开文件选择器（图库）

---

## 🌐 不同环境下的行为

### 1. 移动浏览器（推荐）

#### iOS Safari / Chrome
- ✅ **拍照按钮**：直接打开相机
- ✅ **上传按钮**：打开图库选择器
- ✅ 完美支持 `capture` 属性

#### Android Chrome / Firefox
- ✅ **拍照按钮**：直接打开相机
- ✅ **上传按钮**：打开图库选择器
- ✅ 完美支持 `capture` 属性

### 2. 桌面浏览器

#### Chrome / Edge / Firefox（桌面版）
- ⚠️ **拍照按钮**：可能打开文件选择器（因为没有相机）
- ✅ **上传按钮**：打开文件选择器
- ⚠️ 如果电脑有摄像头，可能会提示选择相机或文件

#### Safari（macOS）
- ⚠️ **拍照按钮**：可能打开文件选择器
- ✅ **上传按钮**：打开文件选择器
- ⚠️ 行为取决于 macOS 版本

### 3. Android APP（Capacitor）

如果使用 Capacitor 打包成 Android APP：

#### 当前实现（Web 方式）
- ✅ **拍照按钮**：调用系统相机
- ✅ **上传按钮**：打开图库
- ✅ 基本功能正常

#### 推荐实现（原生方式）
使用 Capacitor Camera Plugin 可以获得更好的体验：

```typescript
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

// 拍照
const takePicture = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.Uri,
    source: CameraSource.Camera  // 强制使用相机
  });
  
  // 使用 image.webPath
};

// 从图库选择
const pickFromGallery = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.Uri,
    source: CameraSource.Photos  // 强制使用图库
  });
  
  // 使用 image.webPath
};
```

---

## ✅ 当前状态

### 已实现
- ✅ 拍照按钮使用 `capture="environment"`
- ✅ 上传按钮不使用 `capture` 属性
- ✅ 两个按钮功能明确区分
- ✅ 在移动浏览器中完美工作

### 代码位置
- **文件**: `src/pages/AddFood.tsx`
- **手动添加部分**: 第 713-728 行
- **扫描小票部分**: 第 792-807 行

---

## 🔧 测试方法

### 在移动设备上测试

1. **使用手机浏览器访问应用**
   ```
   npm run dev -- --host 0.0.0.0
   ```
   然后在手机浏览器中访问：`http://your-computer-ip:5173`

2. **点击"拍照"按钮**
   - 应该直接打开相机
   - 拍照后自动返回应用

3. **点击"上传图片"按钮**
   - 应该打开图库选择器
   - 选择照片后返回应用

### 在桌面浏览器测试

1. **打开开发者工具**
   - 按 F12 打开 DevTools
   - 切换到移动设备模拟模式（Ctrl+Shift+M）

2. **测试按钮**
   - 桌面浏览器可能无法完全模拟移动设备行为
   - 建议在真实移动设备上测试

---

## 🚀 升级到原生相机（可选）

如果您计划打包成 Android APP，建议使用 Capacitor Camera Plugin：

### 步骤 1：安装插件

```bash
pnpm add @capacitor/camera
```

### 步骤 2：创建相机 Hook

创建 `src/hooks/useCamera.ts`：

```typescript
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export function useCamera() {
  const isNative = Capacitor.isNativePlatform();

  const takePicture = async (): Promise<string | null> => {
    if (!isNative) {
      // Web 环境，使用 HTML5 input
      return null;
    }

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      return image.webPath || null;
    } catch (error) {
      console.error('拍照失败:', error);
      return null;
    }
  };

  const pickFromGallery = async (): Promise<string | null> => {
    if (!isNative) {
      return null;
    }

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });

      return image.webPath || null;
    } catch (error) {
      console.error('选择图片失败:', error);
      return null;
    }
  };

  return { takePicture, pickFromGallery, isNative };
}
```

### 步骤 3：在 AddFood.tsx 中使用

```typescript
import { useCamera } from '@/hooks/useCamera';

// 在组件中
const { takePicture, pickFromGallery, isNative } = useCamera();

const handleTakePhoto = async () => {
  if (isNative) {
    const imagePath = await takePicture();
    if (imagePath) {
      // 处理图片
    }
  } else {
    // 使用现有的 HTML5 input
    cameraInputRef.current?.click();
  }
};

const handleUploadImage = async () => {
  if (isNative) {
    const imagePath = await pickFromGallery();
    if (imagePath) {
      // 处理图片
    }
  } else {
    // 使用现有的 HTML5 input
    fileInputRef.current?.click();
  }
};
```

### 步骤 4：配置权限

在 `android/app/src/main/AndroidManifest.xml` 中添加：

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
```

---

## 📋 常见问题

### Q1: 为什么在桌面浏览器点击"拍照"按钮没有打开相机？

**A**: 桌面浏览器对 `capture` 属性的支持有限。如果电脑没有摄像头，会退化为打开文件选择器。这是正常行为。

**解决方案**: 在移动设备上测试，或者使用 Capacitor 打包成 APP。

### Q2: 如何确保"拍照"按钮一定调用相机？

**A**: 
1. **Web 环境**: 使用 `capture="environment"` 属性（已实现）
2. **APP 环境**: 使用 Capacitor Camera Plugin（推荐）

### Q3: 两个按钮有什么区别？

**A**:
- **📤 上传图片**: 打开图库，选择已有照片
- **📷 拍照**: 直接打开相机，拍摄新照片

### Q4: 在 Android APP 中如何获得最佳体验？

**A**: 
1. 使用 Capacitor Camera Plugin（见上面的升级指南）
2. 配置相机权限
3. 在 `capacitor.config.ts` 中配置插件

---

## 💡 最佳实践

### 1. 移动优先
- 优先在移动设备上测试
- 确保移动浏览器体验良好

### 2. 渐进增强
- Web 环境使用 HTML5 input（当前实现）
- APP 环境使用原生 Camera Plugin（可选升级）

### 3. 用户体验
- 按钮文字清晰（"拍照" vs "上传图片"）
- 图标明确（📷 vs 📤）
- 功能区分明显

### 4. 错误处理
- 处理用户拒绝权限的情况
- 处理相机不可用的情况
- 提供友好的错误提示

---

## 🎯 总结

### 当前实现状态
- ✅ **已正确实现**: 拍照按钮使用 `capture="environment"`
- ✅ **移动浏览器**: 完美支持，直接调用相机
- ⚠️ **桌面浏览器**: 可能退化为文件选择器（正常行为）
- 🚀 **可选升级**: 使用 Capacitor Camera Plugin 获得更好的 APP 体验

### 测试建议
1. 在真实移动设备上测试（推荐）
2. 使用手机浏览器访问应用
3. 测试"拍照"和"上传图片"两个功能
4. 确认相机和图库都能正常调用

### 下一步
如果需要打包成 Android APP，建议：
1. 参考 `ANDROID_APP_GUIDE.md`
2. 安装 Capacitor Camera Plugin
3. 实现原生相机功能
4. 配置相机权限

---

**文档版本**: v1.0  
**最后更新**: 2025-11-19  
**维护者**: FreshGuard 开发团队
