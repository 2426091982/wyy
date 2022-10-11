<script lang='ts' setup>
import {
    HeartOutlined,
    HeartFilled,
    StepBackwardOutlined,
    StepForwardOutlined,
    SoundOutlined,
    FolderAddOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons-vue';
import { 
    getItem,
    handlePlayTime, 
    now, 
    setItem, 
    stop, 
    throttle 
} from '@/utils';
import {
    nextTick, 
    onMounted, 
    ref, 
    watch 
} from 'vue';
import { 
    playListSong, 
    setCurrentTime, 
    setProgress, 
songData
} from '@/utils/song';
import { useStore } from '@/store';
import OutIn from '@/components/out-in.vue';
import PlayBut from '@/components/playBut.vue';
import Icon from '@/components/icon.vue';
import PlayList from '@/components/playList/playList.vue';
import { setKey, timeUpdate } from '@/utils/lyric';
import { message } from 'ant-design-vue';
import { getSongUrl } from '@/api';
import { SongData } from '@/types/song';

const main = ref();
const sound = ref(100);
const showLatelyList = ref(false);
const showLyric = ref(false);
const startPlay = ref(false);
const line = ref<HTMLDivElement>();
const spot = ref<HTMLSpanElement>();
const trunk = ref<HTMLDivElement>();
const store = useStore();
const currentMusic = store.state.currentMusic;
const playList = store.state.playList;
const lyricState = store.state.lyric;
const audio = store.state.audio = document.createElement('audio');

let prevI = 0;
let totalT = 0;
let wait = false;
let isMute = false;
let timer: NodeJS.Timeout;
let timeout: NodeJS.Timeout;
let ooldSound = sound.value;
let key = getItem<number>('play-modle') || 0;
let playModle = [
    'icon-danquxunhuan',
    'icon-liebiaoxunhuan',
    'icon-suijibofang'
];
let modle = ref(playModle[key]);

const handleStartPlay = () => {
    clearTimeout(timer);
    startPlay.value = true;
    timer = setTimeout(() => startPlay.value = false, 2000);
};
// 播放模式
const playStrategy = {
    0() { // 单曲循环
        let timer = setTimeout(() => {
            playSong();
            clearTimeout(timer);
            handleStartPlay();
        });
    },
    1(next: boolean) { // 列表循环
        let { 
            playList: list, 
            playListId: id,
            index, 
            total,
        } = playList;
        if (total > 1) {
            if (next) {
                index < list.length - 1 ? ++index : index = 0;
            } else {
                index > 0 ? --index : index = list.length - 1;
            }
        }
        handleStartPlay();
        let callBack = () => {
            playListSong(list[index], index, list, id);
            if (total > 1) {
                ++index;
            } else { // 处理单曲
                callBack = () => {
                    message.error('没有可播放歌曲！');
                }
            }
        };
        callBack();
    },
    2() { // 随机播放
        let {
            playList: list,
            playListId: id,
            index,
            total,
        } = playList;
        if (total === 0) {
            return message.error('没有可播放歌曲！');
        }
        const randomI: () => number = () =>  {
            if (total === 1) return 0;
            const i = Math.floor(Math.random() * list.length);
            if (i < 0 || i > total || i === prevI) {
                return randomI();
            }
            return i;
        };
        index = randomI();
        console.log(index);
        prevI = index;
        handleStartPlay();
        const callBack = () => {
            playListSong(list[index], index, list, id);
            ++index;
        };
        callBack();
    },
};

/**
 * 选择音质
 * @param key 音质的质量
 */
const selectQuality = (key: number) => {
    console.log(key);
};

/**
 * 切换播放模式
 */
const switchPlayModle = () => {
    ++key > playModle.length-1 ? key = 0 : null;
    let mode = playModle[key];
    setItem('play-modle', key);
    modle.value = mode;
};

/**
 * 静音
 */
const mute = () => {
    isMute = !isMute;
    if (isMute) {
        ooldSound = sound.value;
        sound.value = 0;
    } else {
        sound.value = ooldSound;
    }
    changeSound(sound.value);
};


/**
 * 开始（暂停）播放
 */
const playSong = () => {
    if (!currentMusic.url) return;
    if (!currentMusic.play) handleStartPlay();
    store.commit('currentMusic/playSong', !currentMusic.play);
};

/**
 * 设置歌曲总时间
 */
const totalTime = () => {
    totalT = Math.floor(audio.duration);
    store.commit('currentMusic/changeTotalTime', handlePlayTime(totalT));
};

/**
 * 逐渐大声播放小声暂停
 * @param play true播放 false暂停
 */
const gradually = (play: boolean) => {
    return new Promise((resolve) => {
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        const oldVol = audio.volume;
        audio.volume = play ? 0 : oldVol;
        clearInterval(timeout);
        const fn = () => {
            let newVal = audio.volume;
            if (play) {
                newVal = +Math.min(oldVol, newVal += 0.05).toFixed(2);
                audio.volume = newVal;
            } else {
                newVal = +Math.max(0, newVal -= 0.05).toFixed(2);
                audio.volume = newVal;
            }
            if (
                (newVal === oldVol && play)
                || (newVal === 0 && !play)
            ) {
                clearInterval(timeout);
                resolve(audio.volume = 1);
            }
        };
        timeout = setInterval(fn, 50);
    });
};

const handleError = async () => {
    const { url, } = await songData(currentMusic.id);
    currentMusic.url = url;
};

const processingError = async () => {
    audio.play().then(() => gradually(true)).catch(handleError);
};

/**
 * 开始或暂停播放
 * @param val true播放 false暂停
 */
const handlePlay = <T>(val: T) => {
    /* 开始播放和暂停播放 */
    const handle = async () => {
        if(wait) return;
        if (typeof val === 'string') {
            // 如果音频没有加载回来那么久会走这里
            if (!audio.duration) {
                wait = true;
                const waitFn = () => {
                    handle();
                    wait = false;
                    audio.removeEventListener('canplay', waitFn);
                };
                audio.addEventListener('canplay', waitFn);
            } else {
                processingError();
            }
            lyricState.key ? store.commit('lyric/setKey', 0) : null;
        } else if (val) {
            processingError();
        } else {
            await gradually(false);
            audio.pause();
        }
    };
    nextTick(handle);
};

const handleURL = (url: string) => {
    audio.src = url;
    setProgress(0);
    currentMusic.currentTime = '00:00';
    audio.play().catch(handleError);
};

/**
 * 当声音UI值发生改变音频声音跟随改变
 * @param value 
 */
const changeSound = (value: number) => {
    audio.volume = value / 100;
};

/* 对点击其他地方进行关闭的处理 */
const clickOuterClose = (e: Event) => {
    const el = e.target as HTMLElement;
    const lists = document.querySelectorAll('.showLatelyList');
    for (let i = 0; i < lists.length; i++) if (lists[i].contains(el)) return;
    showLatelyList.value = false;
    document.removeEventListener('click', clickOuterClose);
};

/* 切换列表的显示隐藏 */
const switchshowLatelyList = () => {
    showLatelyList.value = !showLatelyList.value;
    if (showLatelyList.value) {
        document.addEventListener('click', clickOuterClose);
    }
};

/* 清空当前播放列表 */
const clearList = () => {
    store.commit('currentMusic/clearState');
    store.commit('playList/clearList');
    setProgress(0);
};

// 上一首
const prevSong = () => {
    if (key === 0) {
        playStrategy[1](false);
    } else{
        playStrategy[key](false);
    }
};

// 下一首
const nextSong = () => {
    if (key === 0) {
        playStrategy[1](true);
    } else{
        playStrategy[key](true);
    }
};

onMounted(() => {
    if (!spot.value || !trunk.value) return;
    let startL: number;
    let startX: number;
    let progress: number;
    let el: HTMLSpanElement;
    let time: NodeJS.Timeout;
    let width: number;
    /* 点击播放 */
    let play = () => {
        clearInterval(time);
        setCurrentTime();
        time = setInterval(setCurrentTime, 1000);
    };
    /* 可以播放 */
    let canplay = () => {
        wait = false;
        totalTime();
        handleStartPlay();
        const currentPlayItem = Object.assign({
            composer: currentMusic.artists,
            name: currentMusic.name,
            playTime: now(),
            id: currentMusic.id,
            totalTime: currentMusic.totalTime,
        }, currentMusic);
        store.commit('playList/updateState', currentPlayItem);
    };
    /* 结束播放 */
    let ended = () => {
        clearInterval(time);
        store.commit('currentMusic/playSong', false);
        nextSong();
    };
    /* 按下空格进行播放或停止 */
    let keydown = (e: KeyboardEvent) => {
        switch (e.code) {
            case 'Space':
                playSong();
                break;
            case 'ArrowLeft':
                prevSong();
                break;
            case 'ArrowRight':
                nextSong();
        }
    };
    /**
     * 按下歌曲进度条小圆点定位记录起始位置
     */
    let mouseDown = (e: MouseEvent) => {
        clearInterval(time);
        // 禁止传播
        stop(e);
        startX = e.pageX;
        el = e.target as HTMLSpanElement;
        startL = el.offsetLeft;
        el.style.display = 'block';
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        width = trunk.value!.clientWidth;
        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
    };
    /**
     * 拖动歌曲进度条小圆点定位到歌曲时间
     */
    let mouseMove = (e: MouseEvent) => {
        // 定位进度条
        let curX = e.pageX - startX + startL;
        let left = curX / width * 100;
        left = left >= 100 ? 100 : left <= 0 ? 0 : left;
        progress = totalT * (left / 100);
        setProgress(left);
    };
    /**
     * 松开歌曲进度条小圆点定位到歌曲时间
     */
    let mouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseup', mouseUp);
        // 如果松开的值等于开始值那么不做任何处理
        if (e.pageX === startX) return;
        // 播放音乐
        clearInterval(time);
        // 更新当前时间
        audio.currentTime = Math.min(progress ?? audio.currentTime, totalT);
        setCurrentTime();
        // 当前时间不等于结束时间，继续更新当前时间的值
        if (audio.currentTime !== totalT) {
            time = setInterval(setCurrentTime, 1000);
        } else {
            audio.currentTime = audio.duration;
        }
        el.style.display = '';
        // 歌词跟随
        if (document.querySelector('.lyric-list')) {
            setKey(audio, true); 
        }
    };
    /**
     * 随机点击进度条，定位到点击的位置的歌曲时间
     */
    let atWillClick = (e: MouseEvent) => {
        if (!trunk.value) return;
        let left = trunk.value.offsetLeft;
        let width =  trunk.value.clientWidth;
        let progress = ((e.pageX - left) / width * 100);
        progress = +progress.toFixed(2);
        setProgress(progress);
        audio.currentTime = totalT * (progress / 100); 
        setCurrentTime();
        // 歌词跟随
        if (document.querySelector('.lyric-list')) {
            setKey(audio, true); 
        }
    };

    // 获取当前audio的音量赋值到音量条上
    sound.value = audio.volume * 100;
    main.value = document.querySelector('main');
    // 绑定事件
    document.addEventListener('keydown', throttle(keydown, 500));
    spot.value.addEventListener('mousedown', mouseDown);
    trunk.value.addEventListener('mousedown', throttle(atWillClick));
    audio.addEventListener('canplay', canplay);
    audio.addEventListener('ended', ended);
    audio.addEventListener('play', play);
    audio.addEventListener('pause', () => clearInterval(time));
    audio.addEventListener('error', async () => {
        const [{url}] = await getSongUrl<SongData[]>(currentMusic.id);
        currentMusic.url = url;
    });
    audio.addEventListener('timeupdate', timeUpdate);
});

watch(() => currentMusic.play, handlePlay);
watch(() => currentMusic.url, handleURL);
</script>

<template>
    <div :class="`song-detail-container ${!currentMusic.url ? 'invalid' : ''}`">
        <div class="song-detail">
            <img loading="lazy" 
                :src="currentMusic.pic + '?param=50y50'" 
                @click="$router.push('/lyric')"
            >
            <div class="song-info">
                <p>{{ currentMusic.name }}</p>
                <p>{{ currentMusic.artists }}</p>
            </div>
            <div class="song-like-but">
                <heart-outlined 
                    v-if="!currentMusic.likes" 
                    class="song-icon-like" 
                    @click="currentMusic.likes = true" 
                />
                <heart-filled 
                    v-else 
                    class="song-icon-like" 
                    style="color: red" 
                    @click="currentMusic.likes = false" 
                />
            </div>
        </div>
    </div>
    <div :class="`song-control ${!currentMusic.url ? 'unable-play' : ''}`">
        <div class="song-control-item  showLatelyList">
            <div class="play-mode base-pointer">
                <Icon 
                    class="control-but" 
                    :type="modle" 
                    size="16" 
                    @click="switchPlayModle"
                ></Icon>
            </div>
            <step-backward-outlined class="base-size20px control-but" @click="prevSong" />
            <div class="play">
                <PlayBut 
                    :play="currentMusic.play" 
                    @click="playSong"
                ></PlayBut>
            </div>
            <step-forward-outlined class="base-size20px control-but" @click="nextSong" /> 
            <div :class="showLyric ? 'show-lyric' : ''">
                <span class="control-but base-pointer" @click="showLyric = !showLyric">词</span>
            </div>
        </div>
        <div class="progress">
            <span class="progress-time">{{ currentMusic.currentTime }}</span>
            <div ref="trunk" class="progress-line">
                <div 
                    ref="line"
                    id="progress-play-line" 
                    class="progress-play-line"
                >
                    <span 
                        ref="spot" 
                        id="spot"
                        class="spot"
                    ></span>
                </div>
            </div>
            <span class="progress-time">{{ currentMusic.totalTime }}</span>
        </div>
    </div>
    <div :class="`user-options ${!currentMusic.url ? 'invalid' : ''}`">
        <a-dropdown>
            <template #overlay>
                <a-menu class="quality-list" @click="selectQuality(key)">
                    <a-menu-item class="quality-item" key="1">标准音质</a-menu-item>
                    <a-menu-item class="quality-item" key="2">较高音质</a-menu-item>
                    <a-menu-item class="quality-item" key="3">极高音质</a-menu-item>
                    <a-menu-item class="quality-item" key="4">无损音质</a-menu-item>
                </a-menu>
            </template>
            <span class="quality">
                标准音质
            </span>
        </a-dropdown>
        <div class="voice">
            <a-popover trigger="hover">
                <template #content>
                    <a-slider 
                        v-model:value="sound" 
                        vertical 
                        :tip-formatter="null"
                        @change="changeSound(sound)" 
                        class="sound-slider" 
                    />
                </template>
                <sound-outlined class="control-but" @click="mute"/>
            </a-popover>
        </div>
        <menu-unfold-outlined class="control-but" @click.stop="switchshowLatelyList"/>
    </div>
    <out-in mode="default">
        <div v-show="startPlay" class="tips-play base-absolute base-pointer"> 已开始播放 </div>
    </out-in>
    <a-drawer
        v-model:visible="showLatelyList"
        class="lately-list showLatelyList"
        placement="right"
        :mask="false"
        :closable="false"
        :getContainer="main"
    >
        <template #title>
            <h3>当前播放</h3>
            <div class="sub-title">
                <div class="song-total">共 {{ playList.total }} 首</div>
                <div>
                    <span class="collect-all base-pointer"> 
                        <folder-add-outlined />
                        收藏全部 
                    </span>
                    <span class="clear-all base-pointer" @click="clearList"> 清空列表 </span>
                </div>
            </div>
        </template>
        <div class="scroll-body scroll-none">
            <PlayList></PlayList>
        </div>
    </a-drawer>
</template>

<style lang='less'>
.scroll-body {
    height: 100%;
    overflow-y: scroll;
}

.invalid {
    opacity: 0;
    pointer-events: none;
}

.unable-play {
    pointer-events: none;
    opacity: 0.5;
}

.song-detail-container {
    width: 235px;
    overflow: hidden;
}

.song-detail {
    display: grid;
    grid-template-columns: 50px auto minmax(20px, 120px);
    align-items: center;
    gap: 15px;
    height: 60px;
}

.song-info {
    width: auto;
    transition: opacity 1s;

    & p {
        text-overflow: ellipsis;
        white-space: nowrap
    }
}

.song-detail img {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    cursor: pointer;
}

.song-detail p {
    margin: 0;
}

.song-icon-like {
    padding-top: 10px;
    align-self: stretch;
    font-size: 20px;
    color: #999999;
    cursor: pointer;
}

.song-control {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.song-but {
    font-size: 20px;
}

.song-control-item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 230px;
    height: 60px;
    gap: 20px;

    span {
        color: #555555;
    }
}

.control-but {
    color: #333333;
    transition: color 0.2s;

    &:hover {
        color: #1890ff;
    }
}

.play {
    position: relative;
    padding: 16px;
    border-radius: 50%;
    overflow: hidden;


    .play-but-mask {
        background-color: #f0f0f0;
        transition: background-color 0.4s;

        &:hover {
            background-color: #dddddd;
        }
    }
}

.show-lyric > span {
    color: #1890ff;
    font-weight: 700;
}

.progress {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.progress-line {
    position: relative;
    width: 375px;
    height: 4px;
    background-color: #dddddd;
    border-radius: 4px;
    transition-property: background-color, width, height;
    transition-duration: 0.2s;

    &:active {
        height: 6px;

        .spot {
            width: 12px;
            height: 12px;
            display: block;
        }
    }

    &:hover {
        height: 6px;

        .spot {
            width: 12px;
            height: 12px;
            display: block;
        }
    }
}

.progress-time {
    min-width: 40px;
}

.progress-play-line {
    width: 0%;
    height: 100%;
    border-radius: 6px;
    background-color: #1890ff;
}

.spot {
    display: none;
    position: absolute;
    top: 50%;
    left: 0;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #1890ff;
    transform: translate(-50%, -50%);
    transition-property: width, height;
    transition-duration: 0.2s;
    cursor: pointer;
}

.user-options {
    max-width: 122px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.user-options button {
    padding: 0px 10px;
    min-width: 180px;
    height: 30px;
}

.play-mode {
    height: 16px;
}

.quality {
    padding: 2px;
    border: 1px solid #999999;
    font-size: 12px;
    cursor: pointer;

    &:hover {
        color: #1890ff;
        border: 1px solid #1890ff;
    }
}

.quality-list {
    width: 100px;
    transform: translateX(-20%);
}

.quality-item {
    padding: 2px;
    font-size: 12px;
    text-align: center;
}

.sound-slider {
    margin: 5px 0;
    height: 100px;
    padding-bottom: 20px;    
}

.lately-list {
    margin-top: 70px;
    height: calc(100% - 160px);
}

.lately-list .ant-drawer-header-title, 
.lately-list .ant-drawer-title,
.sub-title {
    width: 100%;
}

.sub-title {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
}

.song-total {
    color: #999999;
    font-size: 10px;
}

.clear-all {
    margin-left: 10px;
    color: #1890ff;
}

.lately-list .ant-drawer-body {
    padding: 0;
}

.tips-play {
    padding: 4px 15px;
    bottom: 60px;
    right: 30px;
    border-radius: 4px;
    box-shadow: 0px 0px 10px #999999;
    background-color: #ffffff;
    font-size: 12px;
    transition: color 0.2s;
    z-index: 1000;

    &:hover {
        color: #cccccc;
    }
}
</style>

<style lang="less">
@media screen and (max-width: 900px) {
    .song-detail-container {
        width: 130px;
    }

    .song-detail {
        grid-template-columns: 50px auto minmax(20px, 50px);
        gap: 10px;
    }

    .song-info {
        width: 0px;
        opacity: 0;
    }

    .progress-line {
        width: 250px;
    }
}
</style>
