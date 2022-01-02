/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
    CommentInfo,
    DyismaData, 
    JsonData, 
    UserEvents 
} from "@/store/types/user";
import { deconstruction } from ".";

/* 动态总体数据 */
export const parseEventData = (events: DyismaData['events']) => {
    const data = deconstruction([
        'eventTime', 
        'id', 
        'info', 
        'json', 
        'pics', 
        'type', 
        'user',
        'comments',
        'showComments'
    ], events);
    // 
    data.forEach((item: UserEvents, i) => {
        data[i].user = deconstruction(
            [
                'avatarUrl',
                'backgroundUrl',
                'nickname',
                'userId'
            ], 
            item.user
        );
        data[i].json = deconstruction(
            [
                'msg',
                'song'
            ], 
            JSON.parse(
                item.json as unknown as string
            ) as JsonData
        );
        data[i].json.song = deconstruction(
            [
                'alias',
                'artists',
                'id',
                'img80x80',
                'mvid',
                'name',
                'songEvaluation',
                'soundeffectsInfo'
            ],
            data[i].json.song
        );
        data[i].pics = deconstruction(
            [
                'height',
                'originUrl',
                'width'
            ],
            item.pics
        );
        data[i].info = deconstruction(
            [
                'commentThread',
                'liked',
                'threadId'
            ],
            item.info
        );
    });
    return data;
};

/* 动态评论数据 */
export const parseCommentData = (comments: CommentInfo[]) => {
    const data = deconstruction(
        [
            'commentId',
            'beReplied',
            'content', 
            'liked', 
            'likedCount', 
            'time', 
            'timeStr', 
            'user'
        ]
        , comments
    );
    data.forEach((item: CommentInfo, i) => {
        data[i].user = deconstruction(
            [
                'avatarUrl', 
                'nickname'
            ], 
            item.user
        );
        data[i].beReplied = deconstruction(
            [
                'beRepliedCommentId', 
                'content', 
                'user'
            ], 
            item.beReplied
        );
        data[i].beReplied.forEach((item, k) => {
            data[i].beReplied[k].user = deconstruction(
                [
                    'avatarUrl',
                    'nickname'
                ],
                item.user
            );
        });
    });
    return data;
};
