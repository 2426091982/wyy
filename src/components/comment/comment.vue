<script lang='ts' setup>
import {
    CommentOutlined,
    UserOutlined,
    LikeOutlined
} from '@ant-design/icons-vue';
import { 
    CommentInfo, 
    UserEvents
} from "@/store/types/user";
import { 
    commentLike, 
    postComment 
} from "@/api";
import { ref } from "@vue/reactivity";
import { PropType } from "@vue/runtime-core";
import { parseDate, stop } from '@/utils';
import { message } from 'ant-design-vue';

const { sourceData, } = defineProps({
    sourceData: {
        type: Object as PropType<UserEvents>,
        required: true,
    },
    commentData: {
        type: Array as PropType<CommentInfo[]>,
        required: true,
    },
});
const emits = defineEmits(['updateCData']);

let t = 1;
let cid: number;
let nickname = '';
let max = ref(140);
let remain = ref(140);
let commentText = ref('');
let commentId = ref();
let comment = ref<HTMLTextAreaElement>();
// @
const aite = () => {
    console.log('@');
};

// 点赞评论
const likeComment = async (id:string, cid: number, like: boolean, comment: CommentInfo) => {
    await commentLike(id, cid, Number(!like), 6);
    comment.liked = !like;
    !like ? comment.likedCount++ : comment.likedCount--;
};

const reply = (name: string, id: number) => {
    t === 1 ? t = 2 : null;
    nickname = name;
    commentText.value = `回复${name}：`;
    remain.value = 140;
    comment.value && comment.value.focus();
    commentId.value = cid = id;
};

type CommentRes = { code: number, comment: CommentInfo };
const sendComment = async (threadId:string) => {
    if (remain.value === 140) {
        message.error('要先输入内容才可以发送评论哦！');
        return;
    }
    const value = commentText.value;
    const content = t === 1 ? value : value.slice(value.indexOf('：') + 1);
    const { code, comment, } = await postComment(t, 6, threadId, content, commentId.value) as CommentRes;
    if ( code !== 200) {
        message.error('评论失败，稍后再试！');
        return;
    }
    message.success('评论成功！');
    commentText.value = '';
    // 更新评论区功能
};

// 监听文本框发生变化时
const textareaChange = (e: Event) => {
    const el = e.target as HTMLInputElement;
    const val = commentText.value =  el.value;
    if (val.startsWith(`回复${nickname}：`)) {
        t === 1 ? t = 2 : null;
        let index = val.indexOf('：');
        max.value = 141 + index;
        remain.value = max.value - val.length;
        commentId.value == null ? commentId.value = cid : null; 
    } else {
        max.value = 140;
        remain.value = 140 - val.length;
        t === 2 ? t = 1 : null;
        commentId.value ? commentId.value = undefined : null;
    }
};
// 清除冒泡
const stopPropagation = (e: KeyboardEvent) => if (e.code === 'Space') stop(e); 
};
</script>

<template>
    <div class="comments">
        <div class="base-side15px">
            <div class="textarea">
                <textarea 
                    ref="comment"
                    cols="6" 
                    rows="4"
                    :value="commentText"
                    :maxlength="max"
                    @input="textareaChange"
                    @keydown="stopPropagation"
                ></textarea>
                <span class="text-count">{{ 140 - remain }}/140</span>
            </div>
            <div class="send-comment ">
                <div>
                    <span class="symbol" @click="aite">@</span>
                    &nbsp;
                    <span class="symbol">#</span>
                </div>
                <a-button class="comment-but" @click="sendComment(sourceData.info.threadId)" > 评论 </a-button>
            </div>
        </div>
        <p v-if="!commentData.length" class="base-text-center">暂时还没有评论，快来枪沙发吧！</p>
        <template v-else>
            <p class="comment-count base-side15px">
                最新评论（ 
                <span> 
                    {{ commentData.length }}
                </span> 
                ）条
            </p>
            <a-comment 
                v-for="(comment) in commentData" 
                :key="comment.time"
                class="comment-container base-side15px"
            >
                <!-- 头像 -->
                <template #avatar>
                    <a-avatar>
                        <template #icon>
                            <a-image 
                                v-if="comment.user.avatarUrl" 
                                :src="comment.user.avatarUrl" 
                                :preview="false"
                            ></a-image>
                            <user-outlined v-else />
                        </template>
                    </a-avatar>
                </template>
                <!-- 作者 -->
                <template #author> 
                    <span class="author"> {{ comment.user.nickname }} </span> 
                </template>
                <!-- 发表时间 -->
                <template #datetime> 
                    <a-tooltip>
                        <template #title> {{ parseDate(comment.time, true) }} </template>
                        {{ comment.timeStr }}
                    </a-tooltip>
                </template>
                <!-- 内容 -->
                <template #content>
                    {{ comment.content }}
                    <div v-if="comment.beReplied.length" class="reply">
                        <span class="author">@{{comment.beReplied[0].user.nickname}}</span>
                        :&nbsp;
                        {{ comment.beReplied[0].content }}
                    </div>
                </template>
                <!-- 底部交互按钮 -->
                <template #actions>
                    <div :class="`${comment.liked ? 'is-like' : ''}`">
                        <like-outlined 
                            class="default" 
                            @click="likeComment(sourceData.info.threadId, comment.commentId, comment.liked, comment)"
                        />
                        <span>&nbsp;{{ comment.likedCount }}</span>
                    </div>
                    <a-divider type="vertical" />
                    <div>
                        <comment-outlined 
                            class="default"
                            @click="reply(comment.user.nickname, comment.commentId)"
                        />
                    </div>  
                </template>
            </a-comment>
        </template>
    </div>
</template>

<style lang='less'>
.comments {
    padding: 15px 0px;
    border-radius: 8px;
    background-color: #f0f0f0;
}

.send-comment {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.textarea {
    position: relative;
}

.text-count {
    position: absolute;
    right: 10px;
    bottom: 10px;
    color: #666666;
}

textarea {
    width: 100%;
    padding: 10px;
    border-radius: 4px !important;
    border: 1px solid #cccccc;
    outline: none;
    resize: none;
    font-size: 14px;
    transition: box-shadow 0.4s;

    &:focus {
        box-shadow: 0px 0px 5px #cccccc;
    }
}

.ant-input-textarea-show-count {
    position: relative;

    &::after {
        position: absolute;
        right: 10px;
        bottom: 10px;
    }
}

.symbol {
    color: #666666;
    font-size: 18px;
    cursor: pointer;

    &:hover {
        color: #000000;
    }
}

.comment-but {
    margin: 10px 0;
    border-radius: 20px;
}

.comment-count {
    font-weight: 600;
    color: #999999;
}

.comment-container {
    border-bottom: 1px solid #cccccc;
    &:last-child {
        border-bottom: none;
    }
}

.ant-comment-actions {
    text-align: end;
}

.reply {
    margin-top: 5px;
    padding: 5px;
    border-radius: 4px;
    background-color: #ffffff;
}

.author {
    color: #1890ff;
    cursor: pointer;
    transition: color 0.5s;

    &:hover {
        color: #1876ce;
    }
}
</style>
