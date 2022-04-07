<script lang='ts' setup>
import { 
    getDefaultSearch, 
    getHotSearchList, 
    getSearchSuggest 
} from '@/api';
import { 
    MobileSearchTipsData,
    SearchDefault, 
    SearchHotData, 
    SearchTipsData,
    SearchTipsListData
} from '@/types/search';
import { 
    fn, 
    getItem, 
    parseArtists, 
    setItem
} from '@/utils';
import {
    SearchOutlined,
    DeleteOutlined,
    CloseOutlined,
    CrownOutlined,
    BranchesOutlined,
    SmileOutlined
} from '@ant-design/icons-vue';
import { ref } from '@vue/reactivity';
import { message } from 'ant-design-vue';
import { Response } from '@/types/base';
import Loading from '../loading.vue';
import OutIn from '../out-in.vue';
import { useRouter } from 'vue-router';
import { handleSymbol, markStr } from '@/utils/search';

const router = useRouter();
const value = ref('');
const placeholder = ref('');
const historyVal = ref('');
const showSearchBox = ref(false);
const loading = ref(false);
const notFind = ref(false);
const search = ref(false);
const popconfirm = ref();
const history = ref<string[]>(getItem('history-search') || []);
const hotSearchList = ref<SearchHotData[]>([]);
const searchBox = ref<HTMLDivElement>();
const searchTips = ref<SearchTipsListData>({} as SearchTipsListData);

let timer: NodeJS.Timeout;

/**
 * 获取搜索框默认文本
 */
const defaultSearchText = async () => {
    const {
        bizQueryInfo,
        realkeyword,
        showKeyword,
    } = await getDefaultSearch() as SearchDefault;
    placeholder.value = showKeyword || realkeyword;
};

/**
 * 获取热搜列表
 */
const getHotList = async () => {
    const hotListData = await getHotSearchList() as SearchHotData[];
    hotSearchList.value = hotListData;
};

defaultSearchText();
getHotList();

const changeHistoryVal  = (val: string | null) => {
    if (val !== null) {
        historyVal.value = val;
    } else if (value.value !== '') {
        historyVal.value = value.value;
    } else {
        historyVal.value = placeholder.value;
    }
};

// 搜索关键字
const matchimgKeyword = (val: string) => {
    value.value = handleSymbol(val);
    if (!value.value) return;
    timer = setTimeout(async () => {
        loading.value = true;
        notFind.value = false;
        changeHistoryVal(value.value);
        try {
            const {
                code: c,
                result: {
                    albums,
                    artists,
                    songs,
                },
            } = await getSearchSuggest(value.value) as Response & SearchTipsData;
            const {
                code,
                result: {
                    allMatch,
                },
            } = await getSearchSuggest(value.value, 'mobile') as Response & MobileSearchTipsData;
            if (c === 200 && code === 200) {
                if (!albums 
                    && !artists 
                    && !allMatch 
                    && !songs
                ) return notFind.value = true;
                let songsName: string[] = [];
                let songsInfo: SearchTipsListData['songs'] = [];
                searchTips.value.albums = albums || [];
                searchTips.value.artists = artists || [];
                allMatch && allMatch.forEach((item) => songsName.push(item.keyword));
                songs && songs.forEach((item) => {
                    const artists = parseArtists(item.artists);
                    const artist = artists.includes(historyVal.value) ? artists : '';
                    songsName.push(`${item.name}${artist}`);
                    songsInfo.push({
                        name: item.name,
                        artist: artists,
                    });
                });
                searchTips.value.allMatch = songsName;
                searchTips.value.songs = songsInfo;
            }
        } finally {
            !showSearchBox.value ? showSearchBox.value = true : null;
            loading.value = false;
        }
    }, 200);
};

/**
 * 当文本框值改动自动搜索
 * @param e 事件对象
 */
const changeValue = (e: InputEvent) => {
    clearTimeout(timer);
    const el = e.target as HTMLInputElement;
    search.value = false;
    matchimgKeyword(el.value);
};

/**
 * 清除所有搜索记录
 */
const deleteHistory = () => {
    history.value = [];
    setItem('history-search', []);
    message.success('删除成功！');
};

/**
 * 清除单项搜索记录
 */
const closeItem = (key: number) => {
    history.value.splice(key, 1);
    setItem('history-search', history.value);
};

/**
 * 确认搜索
 */
const onSearch = async (val: string) => {
    showSearchBox.value = false;
    if (!history.value.includes(val)) {
        setItem('history-search', history.value);
        history.value.push(val);
    }
    value.value = val;
    if (router.currentRoute.value.path !==  `/search/${val}`) {
        router.push(`/search/${val}`);
        search.value = true;
    } 
    
};

document.documentElement.addEventListener('click', (e: MouseEvent) => {
    const el = e.target as HTMLDivElement;
    const shouldReturn = popconfirm.value && popconfirm.value.getPopupDomNode(); // 针对删除提示框做出的判断
    if (shouldReturn && shouldReturn.contains(el)) return;
    if (searchBox.value && searchBox.value.contains(el)) {
        showSearchBox.value = true;
    } else {
        showSearchBox.value = false;
    }
});
</script>

<template>
    <div class="search">
        <a-input
            v-model:vlaue="value"
            :value="value"
            :placeholder="placeholder"
            @keydown.enter="onSearch(value || placeholder)"
            @input="changeValue"
            @click.stop="!showSearchBox ? showSearchBox = true : showSearchBox"
        >
            <template v-slot:prefix>
                <search-outlined style="color: #fff" @click="onSearch(value || placeholder)" />
            </template>
        </a-input>
    </div>
    <div 
        ref="searchBox"
        v-show="showSearchBox" 
        :class="`search-box scroll-style base-pointer ${value ? 'search-tips-list' : ''}`" 
    >
        <out-in mode="out-in">
            <div v-if="!value.length || notFind || search">
                <div v-if="history.length">
                    <p class="search-title">
                        搜索历史
                        <a-popconfirm
                            ref="popconfirm"
                            title="确定删除搜索记录吗？"
                            ok-text="删除"
                            cancel-text="取消"
                            @confirm.stop="deleteHistory"
                            @cancal.stop="fn"
                            @click.stop="fn"
                        >
                            <delete-outlined />
                        </a-popconfirm>
                    </p>
                    <div class="search-history-btns">
                        <button 
                            v-for="(item, key) in history"
                            :key="key"
                            class="search-history-btn ellipsis"
                            @click.stop="onSearch(item)"
                        >
                            {{ item }}
                            <close-outlined 
                                class="history-close base-absolute base-size12px" 
                                @click.stop="closeItem(key)"
                            />
                        </button>
                    </div>
                </div>
                <p class="search-title">热搜榜</p>
                <div 
                    v-for="(item, key) in hotSearchList" 
                    :key="key"
                    @click.stop="onSearch(item.searchWord)"
                    class="search-hot background-f0f0f0"
                >
                    <span :class="key < 3 ? 'top3' : 'search-detail'">{{ key + 1 }}</span>
                    <div>
                        <p style="margin: 0;">
                            <span class="search-name">{{ item.searchWord }}</span>
                            <span class="search-count">{{ item.score }}</span>
                            <span v-if="key === 0" class="search-HOT">HOT</span>
                        </p>
                        <span v-if="item.content" class="search-detail ellipsis">{{ item.content }}</span>
                    </div>
                </div>
            </div>
            <div v-else>
                <Loading :loading="loading" height="200px">
                    <div>
                        <div 
                            v-if="searchTips['allMatch'] && searchTips['allMatch'].length" 
                            class="search-tips"
                        >
                            <p class="search-title">
                                <search-outlined />
                                猜你想搜
                            </p>
                            <ul 
                                class="conjecture-list"
                            >
                                <li 
                                    v-for="(item, key) in searchTips['allMatch']"
                                    :key="key"
                                    @click.stop.prevent="onSearch(item)"
                                    class="background-f0f0f0 ellipsis"
                                >
                                    <span v-html="markStr(item, historyVal)"></span>
                                </li>
                            </ul>
                        </div>
                        <div 
                            v-if="searchTips['songs'] && searchTips['songs'].length"
                            class="search-tips"
                        >
                            <p class="search-title">
                                <branches-outlined />
                                单曲
                            </p>
                            <ul 
                                class="conjecture-list"
                            >
                                <li 
                                    v-for="(item, key) in searchTips['songs']"
                                    :key="key"
                                    @click.stop.prevent="onSearch(`${item.name}-${item.artist}`)"
                                    class="background-f0f0f0 ellipsis"
                                >
                                    <span v-html="markStr(item.name, historyVal)"></span>
                                    &nbsp;- &nbsp;
                                    <span v-html="markStr(item.artist, historyVal)"></span>
                                </li>
                            </ul>
                        </div>
                        <div 
                            v-if="searchTips['artists'] && searchTips['artists'].length" 
                            class="search-tips"
                        >
                            <p class="search-title">
                                <smile-outlined />
                                歌手
                            </p>
                            <ul 
                                class="conjecture-list"
                            >
                                <li 
                                    v-for="(item, key) in searchTips['artists']"
                                    :key="key"
                                    @click.stop.prevent="onSearch(item.name)"
                                    class="background-f0f0f0 ellipsis"
                                >
                                    <span v-html="markStr(item.name, historyVal)"></span>
                                </li>
                            </ul>
                        </div>
                        <div 
                            v-if="searchTips['albums'] && searchTips['albums'].length" 
                            class="search-tips"
                        >
                            <p class="search-title">
                                <crown-outlined />
                                专辑
                            </p>
                            <ul 
                                class="conjecture-list"
                            >
                                <li 
                                    v-for="(item, key) in searchTips['albums']"
                                    :key="key"
                                    @click.stop.prevent="onSearch(`${item.name}-${item.artist.name}`)"
                                    class="background-f0f0f0 ellipsis"
                                >
                                    <span v-html="markStr(item.name, historyVal)"></span>
                                    &nbsp;- &nbsp;
                                    <span v-html="markStr(item.artist.name, historyVal)"></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Loading>
            </div>  
        </out-in>
    </div>
</template>

<style lang='less'>
.top3 {
    color: red;
    font-weight: 700;
}

.background-f0f0f0 {
    transition: background-color 0.2s;

    &:hover {
        background-color: #f0f0f0;
    }
}

.search  {
    .ant-input-affix-wrapper {
        background-color: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 20px;
        color: #ffffff;
    }

    .ant-input {
        padding-left: 10px;
        outline: 0;
        border: none;
        background-color: rgba(255, 255, 255, 0);
        caret-color: #ffffff;
        color: #ffffff;
        &::placeholder {
            color: rgba(255, 255, 255, 0.6);
        }
    }
}

.search-box {
    position: fixed;
    top: 70px;
    left: 220px;
    height: 80vh;
    width: 335px;
    line-height: 20px;
    color: #333333;
    background-color: #ffffff;
    box-shadow: 0px 0px 10px #999999;
    z-index: 100;
    overflow-y: scroll;
    transition: width 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);

    &.search-tips-list {
        width: 400px;
    }
}

.search-title {
    margin: 0;
    padding: 10px 20px;

    span {
        display: inline-block;
        color: #666666;
        font-size: 16px;
        transform: translate(-3px, 2px);
    }
}   

.search-hot {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 55px;
    gap: 20px;
}

.search-HOT {
    color: red;
    font-weight: 700;
    font-style: italic;
    font-family: 粗体;
    font-size: 12px;
}

.search-name {
    font-weight: 700;
}

.search-count {
    padding: 0 8px;
}

.search-count,
.search-detail {
    color: #999999;
}

.search-detail.ellipsis {
    display: inline-block;
    width: 250px;
}

.search-history-btns {
    padding: 0 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px 10px;
}

.search-history-btn {
    position: relative;
    padding: 2px 16px;
    border-radius: 25px;
    border: 1px solid #cccccc;
    background-color: #ffffff;
    outline: none;
    cursor: pointer;
    transition: background-color 0.4s;

    &:hover {
        background-color: #eeeeee;
        
        .history-close {
            display: block;        
        }
    }
}

.history-close {
    display: none;
    top: 50%;
    right: 4px;
    color: #999999;
    transform: translateY(-50%) scale(0.8);
}

.conjecture-list {
    margin: 0;
    padding: 0;
    
    li {
        padding: 0 20px;
        line-height: 55px;
    }
}

mark {
    margin: 0;
    padding: 0;
    color: #1890ff;
    background-color: transparent;
}

.search-tips {
    font-size: 12px;

    li {
        padding-left: 40px;
        line-height: 30px !important;
    }
}
</style>
