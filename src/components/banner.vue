<script lang='ts' setup>
import { 
    LeftOutlined, 
    RightOutlined 
} from "@ant-design/icons-vue";
import { 
    onDeactivated, 
    PropType, 
    ref 
} from "@vue/runtime-core";
import { onActivated } from "vue";
import { Banners } from "@/types/base";

defineProps({
    imgList: Array as PropType<Banners>,
});

let styleData = ref([
    { width:'540px', height: '200px', top: '0px', left: '25%', 'z-index': 10, },
    { width:'435px', height: '160px', top: '20px', left: '60%', 'z-index': 8, },
    { width:'410px', height: '150px', top: '20px', left: '50%', 'z-index': 6, },
    { width:'390px', height: '145px', top: '30px', left: '40%', 'z-index': 4, },
    { width:'380px', height: '140px', top: '30px', left: '26%', 'z-index': 2, },
    { width:'390px', height: '145px', top: '30px', left: '18%', 'z-index': 4, },
    { width:'410px', height: '150px', top: '20px', left: '10%', 'z-index': 6, },
    { width:'435px', height: '160px', top: '20px', left: '0', 'z-index': 8, }
]);
let step = ref(0);
let timer:  NodeJS.Timer;
let length = styleData.value.length;
let clearTimer = () => clearInterval(timer);
// 自动播放
let autoPlay = () => {
    // 自动轮播
    clearTimer();
    timer = setInterval(() => {
        step.value++;
        step.value >=  length ? step.value = 0 : step.value < 0 ? step.value = length - 1 : null;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const data = styleData.value.pop()!;
        styleData.value.unshift(data);
    }, 2000);
};
// 重新排序数据
let sqrt = (step: number) => {
    let data: typeof styleData.value[0];
    if (step > 0) {
        data = styleData.value.pop()!;
        styleData.value.unshift(data);
    } else {
        data = styleData.value.shift()!;
        styleData.value.push(data);
    }
    return data;
};
// 重置点位
let resetStep = () => {
    step.value >= length  ? step.value = 0 : step.value < 0 ? step.value = length - 1 : null;
};
// 点击跳转
let jumpPlay = (key: number) => {
    if (key === step.value) return;
    clearTimer();
    let index: number;
    if (step.value === length - 1 && key === 0) {
        index = 1;
    } else if (step.value === 0 && key === length - 1) {
        index = -1;
    } else {
        index = key - step.value;
    }
    sqrt(index);
    index > 0 ? step.value += 1 : step.value -= 1;
    resetStep();
    autoPlay();
};
// 箭头
let arrow = (direction: 1 | -1) => {
    clearTimer();
    sqrt(direction);
    step.value += direction;
    resetStep();
    autoPlay();
};
// 焦点跟随
let focusFollow = (key: number) => {
    if (key === step.value) return;
    clearTimer();
    let index = key - step.value;
    // 定位进来的点，然后循环到该张图片，每循环一次都需要更新step的值，不然没有效果
    for (let i = 0; i < Math.abs(index); i++) {
        sqrt(index);
        index > 0 ? step.value += 1 : step.value -= 1;
    }
    autoPlay();
};

// 从缓存中提取出来
onActivated(() => {
    autoPlay();
});

// 放进缓存后清除定时器
onDeactivated(() => {
    clearTimer();
});
</script>

<template>
    <div 
        class="carousel" 
        @mouseenter="clearTimer"
        @mouseleave="autoPlay"
    >
        <div class="carousel-track-main">
            <div class="carousel-track">
                <div 
                    v-for="(item, key) in imgList" 
                    :class="`carousel-track-item ${key === 0 ? 'carousel-track-active' : ''}`" 
                    :key="item.imageUrl"
                    :style="styleData[key]"
                    @click="jumpPlay(key)"
                >
                    <div style="position: relative">
                        <img loading="lazy" :src="item.imageUrl + '?param=540y200'" alt="">
                        <span class="typeTitle" :style="{backgroundColor: item.titleColor}"> {{ item.typeTitle }} </span>
                    </div>
                </div>
            </div>
            <div class="carousel-arrow carousel-arrow-left" @click="arrow(-1)"><left-outlined /></div>
            <div class="carousel-arrow carousel-arrow-right" @click="arrow(1)"><right-outlined /></div>
        </div>
        <div class="carousel-spot">
            <div 
                v-for="(item, key) in imgList" 
                :class="`carousel-spot-item ${step === key ? 'carousel-spot-active' : ''}`" 
                :key="key"
                @mouseenter="focusFollow(key)"
            ></div>
        </div>
    </div>
</template>

<style lang='less'>
.carousel {
    position: relative;
    margin-top: 20px;
    width: 100%;
    height: 240px;
    user-select: none;
}

.carousel-track {
    position: relative;
    height: 200px;
}

.carousel-track-item {
    position: absolute;
    width: 540px;
    height: 200px;
    border-radius: 10px;
    overflow: hidden;
    transition: all 500ms;

    img {
        width: 100%;
        pointer-events: none;
    }
}

.typeTitle {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 2px 5px;
    color: #ffffff;
    border-top-left-radius: 10px;
    font-size: 12px;
}

.carousel-track-main:hover .carousel-arrow  {
    display: flex;
}

.carousel-arrow {
    display: none;
    position: absolute;
    top: 50%;
    width: 30px;
    height: 30px;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.4);
    color: #ffffff;
    border-radius: 50%;
    cursor: pointer;
    transform: translateY(-100%);
    z-index: 20;
}

.carousel-arrow-left {
    left: 10px;
}

.carousel-arrow-right {
    right: 10px;
}

.carousel-spot {
    display: flex;
    position: absolute;
    bottom: 10px;
    left: 50%;
    height: 20px;
    justify-content: center;
    align-items: center;
    gap: 20px;
    transform: translateX(-50%);
}

.carousel-spot-item {
    width: 6px;
    height: 6px;
    background-color: #999999;
    border-radius: 50%;
}

.carousel-spot-active {
    background-color: #1890ff;
}
</style>
