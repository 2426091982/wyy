import { defineConfig } from 'vite';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// const resolve = (src: string) => path.resolve('./src', src);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [
                AntDesignVueResolver()
            ],
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve('./src'),
        },
    },
    build: {
        assetsDir: __dirname + '/images',
        sourcemap: true,
        rollupOptions: {
            output: {
                entryFileNames: `js/[name].js`,
                assetFileNames: `css/[name].[ext]`,
                chunkFileNames: 'sourcemap/[name].js',
            }
        }
    }
});
