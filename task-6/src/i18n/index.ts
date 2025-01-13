import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpApi) // Load ngôn ngữ từ file JSON
  .use(LanguageDetector) // Tự động phát hiện ngôn ngữ
  .use(initReactI18next) // Kết nối với React
  .init({
    fallbackLng: 'en', // Ngôn ngữ mặc định
    debug: true, // Hiện log trong console để debug
    interpolation: {
      escapeValue: false, // React đã xử lý XSS
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Đường dẫn tới file ngôn ngữ
    },
  });

export default i18n;
