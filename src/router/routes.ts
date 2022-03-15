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
                path: 'handtailor',
                name: '专属定制',
                component: () => import('@/views/discoveMusic/handtailor/handtailor.vue'),
            },
            {
                path: 'songSheet',
                name: '歌单',
                component: () => import('@/views/discoveMusic/songSheet/songSheet.vue'),
            },
            {
                path: 'rankingList',
                name: '排行榜',
                component: () => import('@/views/discoveMusic/rankingList/rankingList.vue'),
            },
            {
                path: 'singer',
                name: '歌手',
                component: () => import('@/views/discoveMusic/singer/singer.vue'),
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
        path: '/follows',
        component: () => import('@/views/follows/follows.vue'),
    },
    {
        path: '/followeds',
        component: () => import('@/views/followeds/followeds.vue'),
    },
    {
        path: '/songSheet/:id',
        component: () => import('@/views/songSheet/songSheet.vue'),
        children: [
            {
                path: '',
                component: () => import('@/components/playList/playList.vue'),
            },
            {
                path: 'comment',
                component: () => import('@/components/comment.vue'),
            },
            {
                path: 'collection',
                component: () => import('@/components/collection.vue'),
            }
        ],
    }
];

export default routes;
