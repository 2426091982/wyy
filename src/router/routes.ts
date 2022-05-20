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
                meta: {
                    flag: true,
                }
            },
            {
                path: 'songSheet',
                name: '歌单',
                component: () => import('@/views/discoveMusic/songSheet/songSheet.vue'),
                meta: {
                    flag: true,
                }
            },
            {
                path: 'latestMusic',
                name: '最新音乐',
                component: () => import('@/views/discoveMusic/latestMusic/latestMusic.vue'),
                meta: {
                    flag: true,
                }
            }
        ],
    },
    {
        path: '/podcast',
        component: () => import('@/views/podcast/podcast.vue'),
        meta: {
            key: '2',
            name: '播客',
            flag: true,
        },
    },
    {
        path: '/video',
        component: () => import('@/views/video/video.vue'),
        meta: {
            key: '3',
            name: '视频',
            flag: true,
        },
    },
    {
        path: '/friends',
        component: () => import('@/views/friend/friend.vue'),
        meta: {
            key: '4',
            name: '朋友',
            flag: true,
        },
    },
    {
        path: '/privateFM',
        component: () => import('@/views/privateFM/privateFM.vue'),
        meta: {
            key: '5',
            name: '私人FM',
            flag: true,
        },
    },
    {
        path: '/myMusic',
        component: () => import('@/views/myMusic/myMusic.vue'),
        meta: {
            name: '我的音乐',
            flag: true,
        },
    },
    {
        path: '/dynamic',
        component: () => import('@/views/dynamic/dynamic.vue'),
        meta: {
            name: '动态',
            flag: true,
        }
    },
    {
        path: '/songSheet/:id',
        name: 'songSheet',
        component: () => import('@/views/songSheet/songSheet.vue'),
        meta: { flag: true, },
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
        meta: { flag: true, },
    },
    {
        path: '/highquality/:cat',
        name: '精品歌单',
        component: () => import('@/components/highqualitySongSheet.vue'),
        meta: { flag: true, },
    },
    {
        path: '/lyric',
        name: 'lyric',
        component: () => import('@/views/lyric/index.vue'),
        meta: { flag: true, },
    },
    {
        path: '/search/:keyword',
        name: '搜索详情',
        component: () => import('@/views/search/index.vue'),
        meta: { flag: true, },
    }
];

export default routes;
