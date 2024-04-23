import { createApp } from 'vue';
import App from './App.vue';
import { setupRouter } from './router';
import { setupStore } from './store';
import { setupI18n } from './locales/setupI18n';

// import Antd from 'ant-design-vue';
// import 'ant-design-vue/dist/reset.css';

const app = createApp(App);
// app.use(Antd);
await setupStore(app);
await setupI18n(app);
setupRouter(app);
app.mount('#app');
