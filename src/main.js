import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// Framework7 imports
import Framework7 from 'framework7/lite-bundle';
import Framework7Vue, { registerComponents } from 'framework7-vue/bundle';
import 'framework7/css/bundle';
import './styles/main.css';

// Framework7 setup
Framework7.use(Framework7Vue);

const app = createApp(App);
const pinia = createPinia();

registerComponents(app);
app.use(pinia);
app.use(router);

app.mount('#app');
