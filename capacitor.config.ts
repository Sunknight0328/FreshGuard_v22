import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.freshguard.app',
  appName: 'FreshGuard',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos'],
    },
    LocalNotifications: {
      smallIcon: 'ic_launcher_foreground',
      iconColor: '#22c55e',
    },
  },
};

export default config;
