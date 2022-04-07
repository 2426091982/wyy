import router from '@/router';
import { store } from '@/store';

const lyricState = store.state.lyric;
const currentRoute = router.currentRoute;
const floor = (num: number) => Math.floor(num);

/**
 * 根据当前播放时间，设置新的Key
 * @param el 音频元素
 * @param jump 是否跳到指定音频
 */
export const setKey = (el: HTMLAudioElement, jump = false) => {
    if (!currentRoute.value.path.startsWith('/lyric') && lyricState.wait) return;
    const lyric = lyricState.lyric;
    const currentTime = floor(+el.currentTime.toFixed(3) + lyricState.plusTime + lyricState.plusTime);
    const legnth = lyric.length;
    for (let i = 0; i < legnth; i++) {
        const item = lyric[i];
        const time = floor(item.time);
        if (jump) {
            // 只要当前时间小于歌词对应时间，获取它上一句就是对应的歌词
            if (currentTime < time) {
                lyricState.key = i - 1;
                lyricState.wait = true;
                break;
            // 当时间大于最后歌词最后一句的话，就取最后一句
            } else if (currentTime >= floor(lyric[legnth - 1].time)) {
                lyricState.key =  legnth - 1;
                lyricState.wait = true;
                break;
            }
        } else if(currentTime >= time && i > lyricState.key) {
            store.commit('lyric/setKey', i);
            break;
        }
    }
};

/**
 * 当前播放时间改变，歌词跟随滚动
 */
export const timeUpdate = (e: Event) => {
    const el = e.target as HTMLAudioElement;
    if (el && !lyricState.wait) setKey(el);
};
