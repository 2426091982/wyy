import { RouteRecordRaw } from 'vue-router';
import DiscoveMusic from '@/views/discoveMusic/discoveMusic.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/discoveMusic',
    },
    {
        path: '/discoveMusic',
        component: DiscoveMusic,
        redirect: '/discoveMusic/recommend',
        meta: {
            menuKey: 0,
            showToMenu: true,
            name: '发现音乐',
        },
        children: [
            {
                path: 'recommend',
                name: '个性推荐',
                component: () => import('@/views/discoveMusic/recommend/recommend.vue'),
                meta: {
                    isRecordPath: true,
                }
            },
            {
                path: 'songSheet',
                name: '歌单',
                component: () => import('@/views/discoveMusic/songSheet/songSheet.vue'),
                meta: {
                    isRecordPath: true,
                }
            },
            {
                path: 'latestMusic',
                name: '最新音乐',
                component: () => import('@/views/discoveMusic/latestMusic/latestMusic.vue'),
                meta: {
                    isRecordPath: true,
                }
            }
        ],
    },
    {
        path: '/metaWorld',
        name: 'metaWorld',
        component: () => import('@/views/metaWorld/index.vue'),
        meta: {
            menuKey: 1,
            showToMenu: true,
            name: '元世界',
            isRecordPath: true,
        },
    },
    {
        path: '/songSheet/:id',
        name: 'songSheet',
        component: () => import('@/views/songSheet/songSheet.vue'),
        meta: { isRecordPath: true, },
        children: [
            {
                path: '',
                name: 'playList',
                component: () => import('@/components/playList/playList.vue'),
            }
        ],
    },
    {
        path: '/mv/:id',
        component: () => import('@/views/mv/mv.vue'),
        meta: { isRecordPath: true, },
    },
    {
        path: '/highquality/:cat',
        name: '精品歌单',
        component: () => import('@/components/highqualitySongSheet.vue'),
        meta: { isRecordPath: true, },
    },
    {
        path: '/lyric',
        name: 'lyric',
        component: () => import('@/views/lyric/index.vue'),
        meta: { isRecordPath: true, },
    },
    {
        path: '/search/:keyword',
        name: '搜索详情',
        component: () => import('@/views/search/index.vue'),
        meta: { isRecordPath: true, },
    }
];

export default routes;
