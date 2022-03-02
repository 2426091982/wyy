<script lang='ts' setup>
import { useStore } from '@/store';

const store = useStore();
const currentMusic = store.state.currentMusic;
const playList = store.state.playList.lately;
</script>

<template>
    <div class="current-play-list">
        <div 
            v-for="(item) in playList"
            :key="item.id"
            :class="`current-play-item ${currentMusic.id === item.id ? 'play-item' : ''}`"
            @dblclick="store.commit('currentMusic/changeState', item)"
        >
            <div class="song-name ellipsis">
                {{ item.name }}
            </div>
            <div class="song-composer ellipsis">
                {{ item.artists }}
            </div>
            <div class="size-time ellipsis">
                {{ item.totalTime }}
            </div>
        </div>
    </div>
</template>

<style lang='less'>
.current-play-list {
    user-select: none;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.5s;
}

.current-play-item {
    display: flex;
    padding: 5px;
    justify-content: space-evenly;
    align-items: center;
    transition: background-color 0.2s;

    &:nth-child(even) {
        background-color: rgba(200, 200, 200, 0.2);
    }

    &:hover {
        background-color: rgba(200, 200, 200, 0.4);
    }
}

.play-item {
    .song-name {
        color: #1890ff;
    }

    .song-composer {
        color: #1890ff;
    }
}

.song-name {
    width: 110px;
}

.song-composer {
    flex-basis: 90px;
}

.size-time {
    width: 50px;
    color: #999999;
}
</style>
