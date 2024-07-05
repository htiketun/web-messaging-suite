import { createApp } from 'vue';
import './assets/app.css';
import App from './App.vue';
import router from './router';
import i18n from './i18n';
const app = createApp(App);

app.use(router);
app.use(i18n);

app.mount('#app');
// Commit 3: 2024-07-05T16:41:48
