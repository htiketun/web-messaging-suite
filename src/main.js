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
// Commit 15: 2024-08-02T18:34:30
// Commit 28: 2024-09-02T04:53:08
// Commit 51: 2024-10-26T00:32:01
// Commit 62: 2024-11-20T18:37:25
// Commit 82: 2025-01-06T13:11:08
// Commit 91: 2025-01-27T15:21:23
