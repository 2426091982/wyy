<script lang='ts' setup>
import {
    CaretRightOutlined,
    PauseOutlined
} from '@ant-design/icons-vue';
import OutIn from '@/components/out-in.vue';

const props = defineProps({
    play: {
        type: [Boolean],
        required: true,
    },
    size: {
        type: Number,
        default: 24,
    },
    color: {
        type: String,
    },
});

const style = { 
    fontSize: `${props.size}px`,
    color: props.color,
};
</script>

<template>
    <div class="play-but-mask">
        <OutIn>
            <pause-outlined v-if="play" class="play-but" :style="style" />
            <caret-right-outlined v-else class="play-but" :style="style" />
        </OutIn>
    </div>
</template>

<style lang='less'>
.play-but-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .3);
    cursor: pointer;
}

.play-but {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #ffffff;
}
</style>
