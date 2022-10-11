<!-- @format -->

<script setup lang="ts">
import { ref } from "vue";
import { useInit, useHandleAudio, useCreateGeometry } from "./hooks";
import { useLoadingManager } from "./hooks/useLoadingManager";
import OutIn from "@/components/out-in.vue";
import { computed } from "@vue/reactivity";

const total = ref(0);
const userBehavior = ref(true);

// 获取加载状态
const { loaded, process, textureCount, isError } = useLoadingManager(total);

// 初始化场景
const { scene, camera, renderer, control } = useInit();

// 创建几何体
useCreateGeometry(scene, camera, control);

// 处理音频
const { oceanAmbientSound, audioLoaded } = useHandleAudio(
  scene,
  camera,
  total,
  process,
  textureCount
);

const handleClick = () => {
  userBehavior.value = false;
  if (audioLoaded.value) {
    oceanAmbientSound.play();
  }
};
</script>

<template>
  <OutIn>
    <!-- <div
      v-if="!loaded || !audioLoaded || userBehavior"
      class="loading-container"
      @click="handleClick"
      @touchstart="userBehavior = false"
    >
      <div class="loading-process">
        <template v-if="!loaded || !audioLoaded">
          <a-spin />
          <div>正在加载 {{ process }} %</div>
        </template>
        <div v-else class="loaded-text">屏幕点击继续</div>
      </div>
    </div> -->
    <div id="three"></div>
  </OutIn>
</template>

<script lang="ts">
export default {
  name: "metaWorld",
};
</script>

<style lang="less">
@keyframes twinkle {
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}

.loaded-text {
  margin-top: 20px;
  font-size: 16px;
  animation: twinkle 1.5s linear infinite;
}

.loading-process {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  left: 50%;
  bottom: 50px;
  transform: translateX(-50%);
}

.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333333;
  color: #ffffff;
  z-index: 10;
}


.dg {
  position: fixed;
  right: 0;
}

#three {
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
}
</style>
