import 'dotenv/config';
import type { CapacitorConfig } from '@capacitor/cli';

const deployedWebUrl = process.env.VITE_API_BASE_URL?.trim();

const config: CapacitorConfig = {
  appId: 'com.freshguard.app',
  appName: 'FreshGuard',
  webDir: 'dist',
  server: deployedWebUrl
    ? {
        url: deployedWebUrl,
        cleartext: false,
        androidScheme: 'https',
      }
    : {
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
