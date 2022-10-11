<!-- @format -->

<script setup lang="ts">
import { VerticalAlignTopOutlined } from "@ant-design/icons-vue";
import { ref, watch } from "@vue/runtime-core";
import { useStore } from "@/store";
import Header from "@/components/header/index.vue";
import Login from "@/views/user/index.vue";
import Player from "@/components/footer/index.vue";
import OutIn from "./components/out-in.vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { useRoute } from "vue-router";

const store = useStore();
const route = useRoute();
const isMetaWorld = ref(true);
const target = () => document.querySelector("main");

watch(
  () => route.fullPath,
  (path, oldPath) => {
    if (oldPath) {
      isMetaWorld.value = path.includes("metaWorld");
    }
  }
);

window.addEventListener("online", () => (store.state.onLine = true));
window.addEventListener("offline", () => (store.state.onLine = false));
</script>

<template>
  <router-view v-if="isMetaWorld"></router-view>
  <a-config-provider v-else>
    <a-layout style="width: 100%; height: 100%">
      <Header></Header>
      <a-layout>
        <a-layout-content class="main scroll-style">
          <router-view v-slot="{ Component }">
            <out-in v-if="Component">
              <keep-alive exclude="lyric" max="3">
                <component :is="Component" />
              </keep-alive>
            </out-in>
          </router-view>
        </a-layout-content>
      </a-layout>
      <a-layout-footer class="showLatelyList">
        <player></player>
      </a-layout-footer>
    </a-layout>
    <Login></Login>
  </a-config-provider>
  <a-back-top :target="target">
    <vertical-align-top-outlined class="base-size22px" />
  </a-back-top>
</template>

<style lang="less">
html,
body {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  // filter: saturate(0%);
}

ul {
  list-style: none;
}

.scroll-style::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.scroll-style::-webkit-scrollbar-track {
  border-radius: 2px;
  background: #fff;
  box-shadow: none;
}

.scroll-style:hover::-webkit-scrollbar-track {
  box-shadow: inset 0px 0px rgba(0, 0, 0, 0);
}

.scroll-style::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 10px;
}

.scroll-style:hover::-webkit-scrollbar-thumb {
  background: #999999;
  box-shadow: 0px 0px 10px #666;
}

.scroll-style::-webkit-scrollbar-thumb:hover {
  background: #cccccc;
}

.scroll-style::-webkit-scrollbar-corner {
  background: #204754;
}

.scroll-style:hover:-webkit-scrollbar-corner {
  background: transparent;
}

.scroll-style::selection {
  background-color: #1890ff;
}

.scroll-none::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}

#app {
  width: 100%;
  height: 100%;
  color: #333;
  font-family: "微软雅黑 Light";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.ant-menu {
  height: 100%;
}

.base-size12px {
  font-size: 12px;
}

.base-size14px {
  font-size: 14px;
}

.base-size16px {
  font-size: 16px;
}

.base-size18px {
  font-size: 18px;
}

.base-size20px {
  font-size: 20px;
}

.base-size22px {
  font-size: 22px;
}

.base-absolute {
  position: absolute;
}

.base-pointer {
  cursor: pointer;
}

.base-text-center {
  text-align: center;
}

.ant-layout-content {
  padding: 0px 30px;
  background-color: #ffffff;
}

.main {
  width: 100%;
  height: 100%;
  min-width: 495px;
  overflow-x: hidden;
  overflow-y: scroll;
  scroll-behavior: smooth; // css3新属性，可以实现锚点平滑滚动
}

.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.ellipsis-multiline {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ant-layout-footer {
  display: flex;
  padding: 10px 30px;
  min-width: 665px;
  height: 80px;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f0f0f0;
  background-color: #ffffff;
  user-select: none;
}

.ant-back-top {
  display: flex;
  bottom: 130px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  color: #ffffff;
  background-color: rgba(24, 144, 255, 1);
  transition: background-color 0.5s;

  &:hover {
    background-color: rgb(19, 117, 207);
  }
}
</style>
