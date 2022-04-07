<script lang='ts' setup>
import { 
    LyricData, 
    LyricSourceData 
} from "@/types/lyric";
import { 
    onBeforeUnmount,
    onMounted, 
    ref, 
    watch 
} from "@vue/runtime-core";
import { 
    parseLryic, 
    setCurrentTime 
} from "@/utils/song";
import { CaretRightOutlined } from '@ant-design/icons-vue';
import { getLyric } from "@/api";
import { useStore } from "@/store";
import { Response } from "@/types/base";
import { useRouter } from "vue-router";
import { handlePlayTime } from "@/utils";
import OutIn from "@/components/out-in.vue";

const store = useStore();
const router = useRouter();
const active = ref(-1);
const showControl = ref(false);
const control = ref<HTMLDivElement>();
const lyricList = ref<HTMLDivElement>();
const lyricData = ref<LyricData[]>([]);
const lyricState = store.state.lyric;
const songData = store.state.currentMusic;
const lyricContainer = ref<HTMLDivElement>();

// 手动滚动歌词后，需要重新定位当前播放歌词的定时器
let timer: NodeJS.Timeout;

const init = async () => {
    const {
        code,
        lrc,
        klyric,
    } = await getLyric(songData.id) as Response & LyricSourceData;
    if (code === 200 && lrc) {
        lyricData.value = parseLryic(lrc.lyric);
        lyricState.lyric = lyricData.value;
    }
};

const cancelAnimaFn = (el: HTMLDivElement, limit: number, id: number) => {
    el.scrollTop = startTop = limit;
    lyricState.wait ? lyricState.wait = false : null;
    cancelAnimationFrame(id);
};

let id: number;
let startTop:number;
let autoRoll = false;
// 根据key来决定当前滚动条的位置
const roll = (key: number) => {
    cancelAnimationFrame(id);
    const el = lyricContainer.value;
    const lyricBox = lyricList.value;
    if (!el || !lyricBox || autoRoll) return;
    const limit = key * 42;
    startTop = el.scrollTop;
    const animationFn = () => {
        let move = Math.ceil((limit - startTop) / 30);
        el.scrollTop += move;
        // move 大于 0 就是向下滚动，否则就是向上滚动
        if (
            (el.scrollTop >= limit && move > 0) || 
            (el.scrollTop <= limit && move <= 0)
        ) {
            return cancelAnimaFn(el, limit, id);
        }
        id = requestAnimationFrame(animationFn);
    };
    id = requestAnimationFrame(animationFn);
};

const jumpLyric = () => {
    clearTimeout(timer);
    const key = active.value;
    if (key === -1) return;
    showControl.value = autoRoll = false;
    setCurrentTime(lyricState.lyric[key].time);
    lyricState.key = key;
    active.value = -1;
};

onMounted(() => {
    const container = lyricContainer.value;
    const list = lyricList.value;

    if (!songData.id || !songData.name || !container || !list) return router.push('/');

    // 初始化请求歌词数据
    init();

    let prevY = 0;

    // 鼠标在歌词容器按下，代表需要滚动
    const mouseDown = (e: MouseEvent) => {
        clearTimeout(timer);
        prevY = e.pageY; // 重置上一次的位置·
        showControl.value = autoRoll = true; // 显示歌词控件
        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
    };

    const mouseMove = (e: MouseEvent) => {
        if (!container || !list) return;
        let curY = e.pageY;
        let move =  prevY - curY;
        container.scrollTop += move;
        prevY = e.pageY; // 设置上一次位置
        // 获取全部的li进行配对
        const lis = Array.from(list.children as unknown as HTMLLIElement[]);
        for (let i = 0; i < lis.length; i++) {
            const li = lis[i];
            const top = li.offsetTop - container.scrollTop;
            // 符合条件将会高亮显示，不是当前播放
            if (top >= 120 && top <= 150 && active.value !== i) {
                active.value = i;
                break;
            }
        }
    };

    const mouseUp = () => {
        timer = setTimeout(() => {
            active.value = -1;
            showControl.value = autoRoll = false; // 将控件隐藏并且恢复歌词自动滚动
            roll(lyricState.key);
        }, 3000);

        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseup', mouseUp);
    };

    container.addEventListener('mousedown', mouseDown);
});

onBeforeUnmount(() => {
    clearTimeout(timer);
    cancelAnimationFrame(id);
});
watch(
    () => songData.id,
    (n: number) => {
        if (n == null) return;
        init();
    }
);
watch(
    () => lyricState.key,
    (key: number) => {
        if (!isNaN(key)) roll(key);
    }
);
</script>

<template>
    <div class="lyric-layout">
        <div class="dish">
            <div 
                class="base-absolute dish-needle"
                :style="{
                    transform: `${songData.play ? 'rotateZ(0deg)' : 'rotateZ(-40deg)'}`,
                }"
            >
                <img 
                    src="https://s3.music.126.net/mobile-new/img/needle-ab.png?4b81da043356110081e5ccaed2e6f2ad=" 
                    width="85"
                    alt=""
                >
            </div>
            <div 
                class="base-absolute dish-pic"
                :style="{
                    animationPlayState: `${songData.play ? 'running' : 'paused'}`,
                }"
            >
                <img 
                    :src="songData.pic + '?param=215y215'" 
                    width="200" 
                    height="200" 
                >
            </div>
        </div>
        <div class="song-lyric">
            <h1>{{ songData.name }}</h1>
            <p>
                {{ songData.artists }}
                &nbsp;-&nbsp;
                {{ songData.name }}
            </p>
            <div style="position: relative;">
                <div 
                    ref="lyricContainer"
                    class="lyric-container scroll-style"
                >
                    <ul 
                        ref="lyricList" 
                        class="lyric-list" 
                        :style="{
                            height: `${lyricState.lyric.length * 42}px`
                        }"
                    >
                        <li 
                            v-for="(itme, key) in lyricData" 
                            :key="key"
                            :class="`lyric-item ${
                                key === lyricState.key ? 'lyric-highlight' : ''
                            } ${
                                key === active ? 'lyric-active' : ''
                            }`"
                        ><span> {{ itme.lyric }} </span></li>
                    </ul>
                </div>
                <out-in mode="default">
                    <div 
                        ref="control"
                        v-show="showControl" 
                        class="lyric-control base-absolute"
                    >
                        <div>
                            <span>
                                {{ handlePlayTime(
                                    lyricState.lyric[active]?.time || 
                                        lyricState.lyric[lyricState.key]?.time
                                ) }}
                            </span>
                            <div class="before-line"></div></div>
                        <div>
                            <div class="after-line"></div>
                            <caret-right-outlined 
                                class="base-size18px"
                                style="pointer-events: all;"
                                @click.stop="jumpLyric"
                            />
                        </div>
                    </div>
                </out-in>
                <div class="before-mask"></div>
                <div class="after-mask"></div>
            </div>
        </div>
    </div>
</template>

<style lang='less'>

.lyric-layout {
    display: flex;
    margin: 100px auto;
    width: 1500px;
}

.dish {
    position: relative;
    width: 400px;
}

.dish-pic {
    box-sizing: border-box;
    top: 80px;
    left: 120px;
    padding: 30px;
    background-color: #000000;
    box-shadow: 0px 0px 0px 15px #dddddd;
    animation: r 20s linear infinite;
    border-radius: 50%;
    user-select: none;
    pointer-events: none;

    img {
        border-radius: 50%;
    }
}

.dish-needle {
    top: -25px;
    left: 55%;
    width: 150px;
    height: 90px;
    transform-origin: top left;
    transition: transform 0.5s;
    z-index: 10;
}

@keyframes r {
    0% {
        transform: rotateZ(0deg);
    }

    100% {
        transform: rotateZ(360deg);
    }
}

.song-lyric {
    width: 1000px;
    height: 500px;
    text-align: center;
    user-select: none;

    h1 {
        font-size: 24px;
        font-weight: 700px;
        font-family: '粗体';
    }
}

.lyric-container {
    position: relative;
    padding: 130px 0px;
    width: 100%;
    height: 300px;
    overflow-x: hidden;
    overflow-y: scroll;
    z-index: 10;
}

.lyric-control {
    display: flex;
    top: 50%;
    left: 5%;
    width: 90%;
    height: 42px;
    justify-content: space-between;
    transform: translateY(-50%);
    z-index: 10;
    pointer-events: none;

    > div {
        display: flex;
        align-items: center;
    }
}

.before-line,
.after-line {
    display: inline-block;
    width: 100px;
    height: 2px;
}

.before-line {
    margin-left: 5px;
    background: linear-gradient(to right, #cccccc 20%, transparent 100%);
}

.after-line {
    margin-right: 5px;
    background: linear-gradient(to left, #cccccc 20%, transparent 100%);
}

.before-mask,
.after-mask {
    position: absolute;
    left: 0;
    content: ' ';
    width: 98%;
    height: 40px;
    z-index: 10;
    pointer-events: none;
}

.before-mask {
    top: 0px;
    background: linear-gradient(to bottom, #ffffff 10%, transparent);
}

.after-mask {
    bottom: 0px;
    background: linear-gradient(to top, #ffffff 10%, transparent);
}

.lyric-list {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    padding: 0;
}

.lyric-item {
    line-height: 42px;
}

.lyric-highlight {
    font-size: 18px !important;
    font-weight: 700 !important;
}

.lyric-active {
    font-size: 16px;
    font-weight: 700;
}

.lyric-container.scroll-style {
    &:hover::-webkit-scrollbar-track {
        box-shadow: none;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }
    &:hover::-webkit-scrollbar-thumb {
        background: #ccc;
        box-shadow: none;
    }
}

.song-recommend {
    width: 300px;
    height: 260px;
}
</style>
