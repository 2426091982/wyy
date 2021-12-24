import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { store, key } from './store';
import 'ant-design-vue/lib/message/style/index.css'; // 单独引入message的样式
import { message } from 'ant-design-vue';

message.config({
    maxCount: 3,
    top: '100px',
    duration: 3,
});

const app = createApp(App);
app.use(router);
app.use(store, key);
app.mount('#app');
