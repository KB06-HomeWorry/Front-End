import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useKakao } from 'vue3-kakao-maps/@utils';
const kakao_js_api_key = useKakao(import.meta.env.VITE_KAKAO_JS_API_KEY, [
  'clusterer',
  'services',
  'drawing',
]);

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
