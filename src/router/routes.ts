import { RouteRecordRaw } from 'vue-router';
import discoverMusic from '@/views/discoveMusic/discoveMusic.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/discoverMusic',
    },
    {
        path: '/discoverMusic',
        component: discoverMusic,
        meta: {
            key: '1',
            name: '发现音乐',
        },
    },
    {
        path: '/podcast',
        component: () => import('@/views/podcast/podcast.vue'),
        meta: {
            key: '2',
            name: '播客',
        },
    },
    {
        path: '/video',
        component: () => import('@/views/video/video.vue'),
        meta: {
            key: '3',
            name: '视频',
        },
    },
    {
        path: '/friends',
        component: () => import('@/views/friend/friend.vue'),
        meta: {
            key: '4',
            name: '朋友',
        },
    },
    {
        path: '/privateFM',
        component: () => import('@/views/privateFM/privateFM.vue'),
        meta: {
            key: '5',
            name: '私人FM',
        },
    },
    {
        path: '/myMusic',
        component: () => import('@/views/myMusic/myMusic.vue'),
        meta: {
            name: '我的音乐',
        },
    },
    {
        path: '/dynamic',
        component: () => import('@/views/dynamic/dynamic.vue'),
    },
    {
        path: '/follows',
        component: () => import('@/views/follows/follows.vue'),
    },
    {
        path: '/followeds',
        component: () => import('@/views/followeds/followeds.vue'),
    }
];

export default routes;
