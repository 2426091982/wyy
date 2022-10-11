import { defineConfig } from 'vite';
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
    // esbuild: {
    //     jsxFactory: 'h',
    //     jsxFragment: 'Fragment'
    // },

    plugins: [
        // mkcert({ source: "coding" }), // https的证书
        vue(),
        // // vueJSX(),
        Components({
            resolvers: [
                AntDesignVueResolver()
            ],
        })
    ],

    server: {
        port: 3000,
        // https: true
    },

    // optimizeDeps: {
    //     include: ["ant-design-vue/es/locale/zh_CN"]
    // },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },

    // build: {
    //     manifest: true,
    //     assetsDir: __dirname + '/images',
    //     sourcemap: true,
    //     rollupOptions: {
    //         output: {
    //             entryFileNames: `js/[name].js`,
    //             assetFileNames: `css/[name].[ext]`,
    //             chunkFileNames: 'sourcemap/[name].js',
    //         }
    //     }
    // }
});
