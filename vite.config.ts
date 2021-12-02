import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

const resolve = (src: string) => path.resolve('./src', src);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue()
    ],
    resolve: {
        alias: {
            '@': resolve(''),
        },
    },
});
