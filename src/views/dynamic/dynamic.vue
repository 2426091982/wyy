<script lang="ts" setup>
import { 
    onMounted, 
    reactive,
    ref
} from '@vue/runtime-core';
import { 
    Comments,
    CommentInfo,
    DyismaData, 
    UserEvents
} from '@/store/types/user';
import {
    LikeOutlined,
    FormOutlined,
    EllipsisOutlined
} from '@ant-design/icons-vue';
import { 
    getDynamic, 
    getEventComment, 
    resourceLike,
    getSongUrl,
    checkMusic
} from '@/api';
import { 
    parseCommentData, 
    parseEventData 
} from '@/utils/parseData';
import { 
    getItem,
    isLogin,
    parseArtists,
    parseDate 
} from '@/utils';
import { CaretRightOutlined } from '@ant-design/icons-vue';
import { useStore } from '@/store';
import { useRoute } from "vue-router";
import { SongData } from "@/types/song";
import { CurrentMusicState } from '@/store/types/currentMusic';
import Loading from '@/components/loading.vue';
import Comment from '@/components/comment/comment.vue';
import { RecommendSongsData } from '@/store/types/recommendSongs';
import { changePlayList } from '@/utils/song';

type TData = { 
    events: DyismaData['events'] | null,
};

/* 加载组件获取数据 */
onMounted(async () => {
    try {
        const {
            code,
            events,
            more,
        } = await getDynamic(Number(id)) as DyismaData;
        switch (code) {
        case 200:
            isMore.value = more;
            data.events = parseEventData(events);
            break;
        case 400:
            errorMsg.value = '当前是一个非法请求';
        // eslint-disable-next-line no-fallthrough
        default:
            error.value = true;
        }
        // 获取动态下的评论
        data.events?.forEach(async(item) => {
            item.play = false;
            item.comments = await getComment(item);
        });
        loading.value = false;
    } catch(e) {
        error.value = true;
    }
});

let prevId = 0;
let prevKey: number[] = [];
let data = reactive<TData>({ 
    events: null,
});
let isMore = ref<boolean>(false);
let loading = ref<boolean>(true);
let error = ref<boolean>(false);
let errorMsg = ref('请检查你的网络之后再重新获取！');
const store = useStore();
const route = useRoute();
const { name, id, } = route.query;
const currentMusic = store.state.currentMusic;
const playList = store.state.playList;
const tracks = (getItem('play-list') || []) as  RecommendSongsData[];

// 解析分享类型
const parseType = (type: number) => {
    switch(type) {
    case 18:
        return '分享单曲';
    }
};

// 计算九宫格图片样式
const gongGe = (len: number, picH: number) => {
    // 列数
    let column = len >= 3 ? 3 : len;
    // 行数
    let row = len <= 3 ? 1 
        : len <= 6 
            ? 2 
            : 3;
    // 图片数量小于4且不是1 容器高度185px，图片数量大于6张图片高度等于第一张的百分之30，以上不符合则是245px
    picH = Math.ceil(picH * 0.3);
    let height = len < 4 && len !== 1 
        ? '185px' : len > 6 
            ? `${ picH < 126 ? 126 : picH }px` // 如果picH高度小于126那就等于126
            : '245px';
    
    return {
        height,
        display: 'grid',
        gap: `${len > 1 ? '5px': ''}`,
        gridTemplateColumns: `repeat(${column}, ${100 / column }%)`,
        gridTemplateRows: `repeat(${row}, ${100 / row}%)`,
    };
};

const play = async (events: UserEvents[] | null, key: number) => {
    if (!events) return;
    let event = events[key];
    let song = event.json.song;
    let info = {} as CurrentMusicState;
    const len = playList.lately.length;
    // 上一个id和当前音乐id不一样的话将会重新请求并且播放，一样的话就是执行开始或暂停播放
    // 播放一首新的歌曲时，上一次的值将会被重新赋值，并且key会被push到数组里面
    if (prevId !== song.id || !len) {
        prevKey = [];
        prevId = song.id;
        await checkMusic(song.id) as { code: number };
        const songUrl = await getSongUrl(song.id) as SongData[];
        songUrl.forEach((item) => {
            info.url = item.url;
            info.br = item.br;
        });
        info.id = song.id;
        info.name = song.name;
        info.pic = song.img80x80;
        
        info.artists = parseArtists(song.artists);
        info.likes = false; // 去喜欢的音乐列表中匹配
        store.commit('currentMusic/changeState', info);
        store.commit('currentMusic/playSong', true);
    } else {
        store.commit('currentMusic/playSong', !currentMusic.play);
    }
    // 如果上一个id和当前id一样，那么就是在播放上一条动态，我们直接开始或暂停即可
    // 如果key也是上一次就不需要循环全部
    if (prevId === song.id) {
        event.play = !event.play;
        if (prevKey.includes(key) && len) return;
    }
    events.forEach((item, i) => {
        if (i === key || item.json.song.id === song.id) {
            prevKey.push(i);
            item.play = true;
        } else {
            item.play = false;
        }
    });
    changePlayList(tracks, tracks.length, -1);
};

// 点赞或取消点赞
const like = async (liked: boolean, threadId: string, id: number) => {
    if (!isLogin()) return;
    await resourceLike(Number(!liked), 6, threadId) as { code: number };
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    data.events![id].info.liked = !liked;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    let commentThread = data.events![id].info.commentThread;
    !liked ? commentThread.likedCount += 1  : commentThread.likedCount -= 1;
};

// 获取评论
const getComment = async (info :UserEvents): Promise<CommentInfo[]> => {
    // 变量第一次没有被赋值为undfined，之后点击会被取反为布尔值
    if (info.showComments === undefined) {
        info.showComments = true;
        const { comments, } = await getEventComment(info.info.threadId) as Comments;
        return parseCommentData(comments) as CommentInfo[];
    }
    info.showComments = !info.showComments;
    if(info.showComments) return info.comments;
    const { comments, } = await getEventComment(info.info.threadId) as Comments;
    return parseCommentData(comments) as CommentInfo[];
};

// 更新评论数据
const updateCData = (source: UserEvents, cData: CommentInfo) => {
    source.comments.push(cData);
};
</script>

<template>
    <a-result
        v-if="error"
        style="margin-top: 100px"
        status="error"
        title="获取动态失败！"
        :sub-title="errorMsg"
    ></a-result>
    <Loading 
        v-else 
        :loading="loading" 
        top="200px" 
        size="large"
    >
        <div>
            <h2 class="dynamic-author"> {{ name }} 的动态</h2>
            <a-empty v-if="!data.events?.length" description="暂无动态~"/>
            <div 
                v-else
                class="dynamic"
                v-for="(event, id) in data.events" 
                :key="event.id"
            >
                <a-space>
                    <a-avatar size="large">
                        <template #icon>
                            <img loading="lazy" :src="event.user.avatarUrl" alt="头像">
                        </template>
                    </a-avatar>
                    <div class="author-info">
                        <a-space class="author-detail">
                            <div class="author-name"> {{ event.user.nickname }} </div>
                            <span class="detail">{{ parseType(event.type) }}</span>
                        </a-space>
                        <span class="share-time">{{ parseDate(event.eventTime) }}</span>
                    </div>
                </a-space>
                <div class="share-detail base-margin-left50px">
                    <p>{{ event.json.msg }}</p>
                    <div class="share-song showLatelyList base-pointer" @click="play(data.events, id)">
                        <div style="position: relative">
                            <caret-right-outlined class="play-but"/>
                            <img loading="lazy" :src="event.json.song.img80x80" width="40" height="40" alt="音乐">
                        </div>
                        <div class="share-song-detail">
                            <span>
                                {{ event.json.song.name }} <!-- 歌名 -->
                                <span class="share-song-alias">
                                    {{ event.json.song.alias.toString() }} <!-- 歌的别名 -->
                                </span>
                            </span>
                            <span>
                                {{ parseArtists(event.json.song.artists) }} <!-- 作家 -->
                            </span>
                        </div>
                    </div>
                </div>
                <div 
                    v-if="event.pics.length" 
                    class="share-images"
                    :style="gongGe(event.pics.length, event.pics[0].height)"
                >
                    <a-image-preview-group>
                        <a-image 
                            v-for="(pic, key) in event.pics"
                            :key="key"
                            :src="pic.originUrl"
                        />
                    </a-image-preview-group>
                </div>
                <div class="user-operation">
                    <a-space>
                        <div :class="event.info.liked ? 'is-like' : ''">
                            <like-outlined 
                                :class="event.info.liked ? '' : 'default'"
                                @click="like(event.info.liked, event.info.threadId, id)"
                            />
                            <span 
                                v-if="event.info.commentThread.likedCount"
                            >&nbsp;({{ event.info.commentThread.likedCount }})</span>
                        </div>
                        <a-divider type="vertical" class="limit-line" />
                        <div>
                            <form-outlined 
                                @click="getComment(event)" 
                                class="default" 
                            />
                            <span 
                                v-if="event.comments?.length"
                            >&nbsp;({{ event.comments?.length }})</span>
                        </div>
                        <a-divider type="vertical" class="limit-line" />
                        <ellipsis-outlined class="default" />
                    </a-space>
                </div>
                <Comment 
                    v-show="!event.showComments"
                    :source-data="event"
                    :comment-data="event.comments || []"
                    @updateCData="updateCData"
                    class="base-margin-left50px"
                ></Comment>
            </div>
        </div>
    </Loading>
</template>

<style lang="less">
.base-side15px {
    padding: 0px 15px;
}

.base-margin-left50px {
    margin-left: 50px;
}

.dynamic-author {
    margin-bottom: 30px;
    font-weight: 600;
}

.dynamic {
    padding: 10px 0px;
    border-bottom: 1px solid #dddddd;

    &:last-child {
        border-bottom: none;
    }
}

.author-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.author-name {
    color: #0c00b1;
}

.share-time {
    font-size: 12px;
    color: #999999;
}

.share-detail {
    padding-top: 10px;
}

.share-song {
    display: flex;
    padding: 10px;
    height: 60px;
    border-radius: 8px;
    background-color: #f4f4f4;
    transition: background-color 0.2s;

    &:hover {
        background-color: #dddddd;
    }
}

.share-song-detail {
    margin-left: 10px;
    display: flex;
    flex-direction: column;

    & > span:last-child {
        color: #999999;
    }
}

.share-song-alias {
    color: #999999;
}

.share-images {
    margin: 10px 0;
    margin-left: 50px;
    width: 370px;
    height: 245px;
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
        cursor: zoom-in;
    }
}

.user-operation {
    display: flex;
    padding: 10px;
    justify-content: flex-end;
}

.default {
        color: #999999;
        
    &:hover {
        color: #333333;
    }
}

.limit-line {
    border-color: #cccccc;
    margin-left: 20px;
    margin-right: 20px;
}

.is-like span {
    color: red !important;
}
</style>
