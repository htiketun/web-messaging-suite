import { createI18n } from 'vue-i18n';
import messages from './locales/index.js';

const locale = localStorage.getItem('locale') || 'en';
const i18n = createI18n({
    legacy: false, // Use Composition API
    locale,
    fallbackLocale: 'en',
    messages,
});

export default i18n;
