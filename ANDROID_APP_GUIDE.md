# 时鲜管家 - 网页转安卓APP方案

## 📱 推荐方案：Capacitor

### 为什么选择 Capacitor？

**Capacitor** 是由 Ionic 团队开发的现代化跨平台应用运行时，是将网页应用转换为原生移动应用的最佳选择。

#### 优势：
- ✅ **现代化架构** - 基于现代Web标准，性能优秀
- ✅ **原生功能访问** - 支持相机、通知、文件系统等原生API
- ✅ **PWA支持** - 可以同时部署为PWA和原生应用
- ✅ **简单集成** - 与React/Vite项目无缝集成
- ✅ **活跃维护** - 社区活跃，文档完善
- ✅ **插件生态** - 丰富的官方和社区插件
- ✅ **性能优秀** - 使用原生WebView，性能接近原生应用

---

## 🚀 实施步骤

### 第一步：安装 Capacitor

```bash
# 进入项目目录
cd /workspace/app-7noqonmn18g1

# 安装 Capacitor CLI 和核心包
pnpm add @capacitor/core @capacitor/cli

# 初始化 Capacitor
npx cap init "FreshGuard" "com.freshguard.app" --web-dir=dist
```

**参数说明**：
- `"FreshGuard"` - 应用名称
- `"com.freshguard.app"` - 应用包名（Android包名）
- `--web-dir=dist` - 构建输出目录

### 第二步：添加 Android 平台

```bash
# 安装 Android 平台支持
pnpm add @capacitor/android

# 添加 Android 平台
npx cap add android
```

这会在项目根目录创建 `android` 文件夹，包含完整的 Android Studio 项目。

### 第三步：安装必要的插件

根据时鲜管家的功能需求，安装以下插件：

```bash
# 相机插件（用于拍照识别小票）
pnpm add @capacitor/camera

# 文件系统插件（用于图片存储）
pnpm add @capacitor/filesystem

# 本地通知插件（用于保质期提醒）
pnpm add @capacitor/local-notifications

# 状态栏插件（优化界面）
pnpm add @capacitor/status-bar

# 启动画面插件
pnpm add @capacitor/splash-screen

# 网络状态检测
pnpm add @capacitor/network
```

### 第四步：配置 Capacitor

创建或修改 `capacitor.config.ts`：

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.freshguard.app',
  appName: 'FreshGuard',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#22c55e",
      showSpinner: false,
      androidSpinnerStyle: "small",
      spinnerColor: "#ffffff"
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#22c55e",
      sound: "beep.wav"
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#22c55e'
    }
  }
};

export default config;
```

### 第五步：修改构建配置

修改 `vite.config.ts`，确保构建输出适合移动应用：

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // 添加以下配置
  base: './', // 使用相对路径
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 优化移动端性能
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除console
      }
    }
  }
})
```

### 第六步：构建和同步

```bash
# 构建Web应用
npm run build

# 同步到Android项目
npx cap sync android

# 或者一步完成
npm run build && npx cap sync android
```

### 第七步：在 Android Studio 中打开项目

```bash
# 打开 Android Studio
npx cap open android
```

在 Android Studio 中：
1. 等待 Gradle 同步完成
2. 连接 Android 设备或启动模拟器
3. 点击 Run 按钮运行应用

### 第八步：配置应用图标和启动画面

#### 应用图标
将图标文件放置在以下位置：
```
android/app/src/main/res/
├── mipmap-hdpi/ic_launcher.png (72x72)
├── mipmap-mdpi/ic_launcher.png (48x48)
├── mipmap-xhdpi/ic_launcher.png (96x96)
├── mipmap-xxhdpi/ic_launcher.png (144x144)
└── mipmap-xxxhdpi/ic_launcher.png (192x192)
```

#### 启动画面
将启动画面图片放置在：
```
android/app/src/main/res/drawable/splash.png
```

### 第九步：配置权限

编辑 `android/app/src/main/AndroidManifest.xml`，添加必要的权限：

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- 相机权限 -->
    <uses-permission android:name="android.permission.CAMERA" />
    
    <!-- 文件读写权限 -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
    
    <!-- 网络权限 -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- 通知权限 -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
    
    <!-- 相机功能声明 -->
    <uses-feature android:name="android.hardware.camera" android:required="false" />
    
    <application>
        <!-- 应用配置 -->
    </application>
</manifest>
```

### 第十步：打包APK

在 Android Studio 中：

#### 调试版本（用于测试）
```
Build → Build Bundle(s) / APK(s) → Build APK(s)
```

#### 发布版本（用于上架）
```
Build → Generate Signed Bundle / APK → APK
```

需要创建签名密钥：
```bash
keytool -genkey -v -keystore freshguard-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias freshguard
```

---

## 📝 添加 NPM 脚本

在 `package.json` 中添加便捷脚本：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    
    "cap:init": "npx cap init FreshGuard com.freshguard.app --web-dir=dist",
    "cap:add:android": "npx cap add android",
    "cap:sync": "npm run build && npx cap sync",
    "cap:sync:android": "npm run build && npx cap sync android",
    "cap:open:android": "npx cap open android",
    "cap:run:android": "npm run build && npx cap sync android && npx cap run android",
    "android:build": "npm run build && npx cap sync android",
    "android:open": "npx cap open android"
  }
}
```

使用方式：
```bash
# 构建并同步到Android
npm run android:build

# 打开Android Studio
npm run android:open

# 构建、同步并运行
npm run cap:run:android
```

---

## 🔧 代码适配

### 1. 相机功能集成

创建 `src/utils/camera.ts`：

```typescript
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export async function takePicture() {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });
    
    return image.dataUrl;
  } catch (error) {
    console.error('拍照失败:', error);
    throw error;
  }
}

export async function pickImage() {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    });
    
    return image.dataUrl;
  } catch (error) {
    console.error('选择图片失败:', error);
    throw error;
  }
}
```

### 2. 本地通知集成

创建 `src/utils/notifications.ts`：

```typescript
import { LocalNotifications } from '@capacitor/local-notifications';

export async function requestNotificationPermission() {
  const result = await LocalNotifications.requestPermissions();
  return result.display === 'granted';
}

export async function scheduleExpiryNotification(
  foodName: string,
  expiryDate: Date,
  daysBeforeExpiry: number
) {
  const notificationDate = new Date(expiryDate);
  notificationDate.setDate(notificationDate.getDate() - daysBeforeExpiry);
  
  await LocalNotifications.schedule({
    notifications: [
      {
        title: '食材即将过期提醒',
        body: `${foodName} 将在 ${daysBeforeExpiry} 天后过期，请及时食用！`,
        id: Date.now(),
        schedule: { at: notificationDate },
        sound: 'beep.wav',
        smallIcon: 'ic_stat_icon_config_sample',
        iconColor: '#22c55e'
      }
    ]
  });
}
```

### 3. 检测运行环境

创建 `src/utils/platform.ts`：

```typescript
import { Capacitor } from '@capacitor/core';

export const isNative = () => Capacitor.isNativePlatform();
export const isAndroid = () => Capacitor.getPlatform() === 'android';
export const isIOS = () => Capacitor.getPlatform() === 'ios';
export const isWeb = () => Capacitor.getPlatform() === 'web';
```

使用示例：
```typescript
import { isNative } from '@/utils/platform';
import { takePicture } from '@/utils/camera';

if (isNative()) {
  // 使用原生相机
  const photo = await takePicture();
} else {
  // 使用Web相机API或文件上传
  // ...
}
```

---

## 🎨 移动端优化

### 1. 添加视口元标签

在 `index.html` 中确保有以下配置：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta name="theme-color" content="#22c55e">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

### 2. 添加触摸反馈

在 `src/index.css` 中添加：

```css
/* 移动端触摸优化 */
* {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

button, a {
  -webkit-tap-highlight-color: rgba(34, 197, 94, 0.2);
}

/* 防止文本选择 */
.no-select {
  -webkit-user-select: none;
  user-select: none;
}
```

### 3. 状态栏适配

在 `src/App.tsx` 中添加：

```typescript
import { StatusBar, Style } from '@capacitor/status-bar';
import { useEffect } from 'react';

useEffect(() => {
  if (isNative()) {
    StatusBar.setStyle({ style: Style.Light });
    StatusBar.setBackgroundColor({ color: '#22c55e' });
  }
}, []);
```

---

## 📦 打包发布

### 生成发布版APK

1. **创建签名密钥**（首次）：
```bash
keytool -genkey -v -keystore freshguard-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias freshguard
```

2. **配置签名**：
编辑 `android/app/build.gradle`：

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('../../freshguard-release-key.jks')
            storePassword 'your-store-password'
            keyAlias 'freshguard'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

3. **构建发布版**：
```bash
cd android
./gradlew assembleRelease
```

生成的APK位置：
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## 🔄 其他方案对比

### 方案2：Cordova（不推荐）
- ❌ 较老的技术栈
- ❌ 性能不如Capacitor
- ✅ 生态成熟，插件多
- ✅ 文档完善

### 方案3：WebView包装（不推荐）
- ❌ 功能受限
- ❌ 无法访问原生功能
- ✅ 最简单
- ✅ 打包快速

### 方案4：React Native（不推荐）
- ❌ 需要完全重写代码
- ❌ 学习成本高
- ✅ 性能最好
- ✅ 原生体验

---

## 📱 测试清单

打包完成后，需要测试以下功能：

- [ ] 应用启动正常
- [ ] 语言选择功能正常
- [ ] 登录/注册功能正常
- [ ] 相机拍照功能正常
- [ ] 图片上传功能正常
- [ ] 食材列表显示正常
- [ ] 保质期计算正确
- [ ] 本地通知功能正常
- [ ] 网络请求正常（Supabase连接）
- [ ] 界面适配正常（不同屏幕尺寸）
- [ ] 状态栏显示正常
- [ ] 返回键处理正常
- [ ] 应用图标显示正常
- [ ] 启动画面显示正常

---

## 🚀 快速开始命令

```bash
# 1. 安装依赖
pnpm add @capacitor/core @capacitor/cli @capacitor/android
pnpm add @capacitor/camera @capacitor/filesystem @capacitor/local-notifications
pnpm add @capacitor/status-bar @capacitor/splash-screen @capacitor/network

# 2. 初始化Capacitor
npx cap init "FreshGuard" "com.freshguard.app" --web-dir=dist

# 3. 添加Android平台
npx cap add android

# 4. 构建并同步
npm run build && npx cap sync android

# 5. 打开Android Studio
npx cap open android

# 6. 在Android Studio中点击Run按钮运行应用
```

---

## 📚 相关资源

- [Capacitor 官方文档](https://capacitorjs.com/docs)
- [Capacitor Android 文档](https://capacitorjs.com/docs/android)
- [Capacitor 插件市场](https://capacitorjs.com/docs/plugins)
- [Android Studio 下载](https://developer.android.com/studio)

---

## ⚠️ 注意事项

1. **Android Studio 要求**：
   - 需要安装 Android Studio
   - 需要配置 Android SDK
   - 建议使用最新版本

2. **构建环境**：
   - Node.js >= 16
   - Java JDK >= 11
   - Gradle 会自动下载

3. **权限处理**：
   - Android 6.0+ 需要运行时权限请求
   - 相机、通知等功能需要用户授权

4. **性能优化**：
   - 生产环境记得移除 console.log
   - 启用代码压缩和混淆
   - 优化图片资源大小

5. **更新流程**：
   - 修改代码后需要重新构建：`npm run build`
   - 同步到Android：`npx cap sync android`
   - 在Android Studio中重新运行

---

**推荐使用 Capacitor 方案，它是目前最现代、最适合React应用的移动端打包方案！**

---

**文档版本**: v1.0  
**最后更新**: 2025-11-19  
**维护者**: FreshGuard 开发团队
