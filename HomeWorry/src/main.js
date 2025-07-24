import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import { useKakao } from 'vue3-kakao-maps/@utils';
// const kakao_js_api_key = import.meta.env.VITE_KAKAO_JS_API_KEY;
const kakao_js_api_key = '036a40f4851b27eba70f2401b2329146';
useKakao(kakao_js_api_key, ['clusterer', 'services', 'drawing']);

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
