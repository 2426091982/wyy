<script lang='ts' setup>
import {
    HeartOutlined,
    HeartFilled,
    StepBackwardOutlined,
    StepForwardOutlined,
    SoundOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons-vue';
import { nextTick, onMounted, ref, watch } from 'vue';
import { useStore } from '@/store';
import OutIn from '@/components/out-in.vue';
import PlayBut from '@/components/playBut.vue';
import Icon from '@/components/icon.vue';
import { handleTime } from '@/utils';

const store = useStore();
const currentMusic = store.state.currentMusic;
const line = ref<HTMLDivElement>();
const spot = ref<HTMLSpanElement>();
const audio = ref<HTMLAudioElement>();

// 总时间时间
let totalT = 0;

// 选择音质
const selectQuality = (key: number) => {
    console.log(key);
};


const currentTime = () => {
    if(!audio.value || !line.value || !spot.value) return;
    const time = Math.ceil(audio.value.currentTime);
    store.commit('currentMusic/changeCurrentTime', handleTime(time));
    const progress = (time / totalT * 100 || 0).toFixed(2);
    line.value.style.width = `${progress}%`;
    spot.value.style.left = `${progress}%`;
};

const totalTime = () => {
    if(!audio.value) return;
    const time = totalT = Math.floor(audio.value.duration);
    store.commit('currentMusic/changeTotalTime', handleTime(time));
};

onMounted(() => {
    if (!audio.value || !spot.value) return;
    let time: NodeJS.Timeout;
    audio.value.addEventListener('play', () => {
        currentTime();
        clearInterval(time);
        time = setInterval(currentTime, 1000);
    });
    audio.value.addEventListener('pause', () => {
        clearInterval(time);
    });
    audio.value.addEventListener('canplay', () => {
        totalTime();
    });
    spot.value.addEventListener('mousedown', () => {
        // 
    });
});

watch(
    currentMusic, 
    ({play, }) => {
        /* 开始播放和暂停播放 */
        nextTick(async () => {
            if(audio.value == undefined) return;
            if (play) {
                await audio.value.play();
            } else {
                audio.value.pause();
            }
        });
    }
);
</script>

<template>
    <div style="">
        <div class="song-detail">
            <img :src="currentMusic.pic" width="60" height="60" alt="">
            <div class="song-info">
                <p>{{ currentMusic.name }}</p>
                <p>{{ currentMusic.artists }}</p>
            </div>
            <div class="song-like-but">
                <OutIn>
                    <heart-outlined v-if="!currentMusic.likes" class="song-icon-like" @click="currentMusic.likes = true" />
                    <heart-filled v-else class="song-icon-like" style="color: red" @click="currentMusic.likes = false" />
                </OutIn>
            </div>
        </div>
    </div>
    <div class="song-control">
        <div class="song-control-item">
            <div class="play-mode">
                <Icon class="control-but" type="icon-liebiaoxunhuan"></Icon>
            </div>
            <step-backward-outlined class="base-size20px control-but" />
            <div class="play">
                <PlayBut :play="currentMusic.play" @click="store.commit('currentMusic/playSong', !currentMusic.play)"></PlayBut>
            </div>
            <step-forward-outlined class="base-size20px control-but" /> 
            <div class="on-off-lyric">
                <span class="control-but base-pointer">词</span>
            </div>
        </div>
        <div class="progress">
            <span class="progress-time">{{ currentMusic.currentTime }}</span>
            <div class="progress-line">
                <div ref="line" class="progress-play-line">
                    <span ref="spot" class="spot"></span>
                </div>
            </div>
            <span class="progress-time">{{ currentMusic.totalTime }}</span>
        </div>
    </div>
    <div class="user-options">
        <a-dropdown>
            <template #overlay>
                <a-menu class="quality-list" @click="selectQuality">
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
            <sound-outlined class="control-but" />
        </div>
        <menu-unfold-outlined class="control-but"/>
    </div>

    <audio 
        ref="audio" 
        :src="currentMusic.url" 
        style="display: none"
    ></audio>
</template>

<style lang='less'>
.song-detail {
    display: grid;
    grid-template-columns: 50px auto 20px;
    justify-items: center;
    align-items: center;
    gap: 15px;
    max-width: 235px;
    min-width: 180px;
    height: 60px;
}

.song-info {
    overflow: hidden;
    transition: opacity 1s;
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
    transition: background-color 0.2s, width 0.2s;

    &:hover {
        height: 6px;

        .spot {
            display: block;
            background-color: #1890ff;
        }
    }
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
    width: 10px;
    height: 10px;
    border-radius: 50%;
    transform: translate(-50%, -50%);
}

.user-options {
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
</style>

<style lang="less">
@media screen and (max-width: 900px) {
    .song-detail {
        min-width: 100px;
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
