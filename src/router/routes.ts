import { RouteRecordRaw } from 'vue-router';
import DiscoveMusic from '@/views/discoveMusic/discoveMusic.vue';
import Recommend from '@/views/discoveMusic/recommend/recommend.vue';

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
            key: '1',
            name: '发现音乐',
        },
        children: [
            {
                path: 'recommend',
                name: '个性推荐',
                component: Recommend,
            },
            {
                path: 'songSheet',
                name: '歌单',
                component: () => import('@/views/discoveMusic/songSheet/songSheet.vue'),
            },
            {
                path: 'latestMusic',
                name: '最新音乐',
                component: () => import('@/views/discoveMusic/latestMusic/latestMusic.vue'),
            }
        ],
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
        path: '/songSheet/:id',
        name: 'songSheet',
        component: () => import('@/views/songSheet/songSheet.vue'),
        children: [
            {
                path: '',
                component: () => import('@/components/playList/playList.vue'),
            }
        ],
    },
    {
        path: '/mv/:id',
        component: () => import('@/views/mv/mv.vue'),
    },
    {
        path: '/highquality/:cat',
        name: '精品歌单',
        component: () => import('@/components/highqualitySongSheet.vue'),
    },
    {
        path: '/lyric',
        name: '歌词',
        component: () => import('@/views/lyric/index.vue'),
    },
    {
        path: '/search/:keyword',
        name: '搜索详情',
        component: () => import('@/views/search/index.vue'),
    }
];

export default routes;
