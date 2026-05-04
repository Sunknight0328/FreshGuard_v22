import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh from './locales/zh.json';
import en from './locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      zh: { translation: zh },
      en: { translation: en },
    },
    lng: localStorage.getItem('language') || 'zh', // 默认中文，从本地存储读取用户选择
    fallbackLng: 'en', // 回退语言使用英文（确保在切换失败时显示英文而不是中文）
    interpolation: {
      escapeValue: false,
      prefix: '{',
      suffix: '}',
    },
  });

export default i18n;
