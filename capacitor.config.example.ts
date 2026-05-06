/**
 * Capacitor 配置模板 - 将此文件重命名为 capacitor.config.ts 后使用
 *
 * 使用步骤：
 * 1. npm install @capacitor/core @capacitor/cli @capacitor/android
 * 2. 将此文件重命名为 capacitor.config.ts（覆盖 npm init @capacitor/app 生成的版本）
 * 3. 在 .env 中设置 VITE_API_BASE_URL=https://你的已部署域名
 * 4. npm run build
 * 5. npx cap add android
 * 6. npx cap sync
 * 7. npx cap open android（在 Android Studio 中构建 APK）
 *
 * 通知说明：
 *   Web Notification API 在 Android WebView 中不受支持。
 *   如需本地推送通知，需额外安装：
 *   npm install @capacitor/local-notifications
 *   并参考 https://capacitorjs.com/docs/apis/local-notifications
 */

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // ✏️ 修改为你的包名（反向域名格式）
  appId: 'com.yourcompany.freshguard',
  // ✏️ 修改为你的应用名称
  appName: '时鲜管家',
  // Vite 构建输出目录
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // ✏️ 如果想直接加载已部署的线上版本（推荐，可规避 API 代理问题），
    //    取消下面这行注释并填入你的域名。
    //    使用线上 URL 时，VITE_API_BASE_URL 不需要额外设置。
    // url: 'https://your-deployed-app.example.com',
    //
    // ✏️ 如果选择本地打包（dist 目录），则注释掉 url 那行，
    //    并确保在 .env 中设置了正确的 VITE_API_BASE_URL。
    cleartext: false,
  },
  android: {
    // 允许混合内容（HTTPS 页面请求 HTTP 资源），通常不需要
    allowMixedContent: false,
    // 捕获输入（摄像头等）
    captureInput: true,
    // WebView 调试（发布时改为 false）
    webContentsDebuggingEnabled: true,
  },
  plugins: {
    // 如果安装了 @capacitor/local-notifications，可在此配置
    // LocalNotifications: {
    //   smallIcon: 'ic_stat_icon_config_sample',
    //   iconColor: '#488AFF',
    // },
  },
};

export default config;
