/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewSongData } from "@/store/types/newSong";
import { RecommendSongsData } from "@/store/types/recommendSongs";
import { SongSheetData } from "@/store/types/recommendSongSheet";
import { 
    CommentInfo,
    DyismaData, 
    JsonData, 
    UserEvents 
} from "@/store/types/user";
import { Banners } from "@/types/base";
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
        'showComments',
        'play'
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
                'nickname',
                'userId'
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
                    'nickname',
                    'userId'
                ],
                item.user
            );
        });
    });
    return data;
};

/* 解析banner数据 */
export const parseBannerData = (banners: Banners) => {
    const data = deconstruction([
        'encodeId', 
        'exclusive', 
        'imageUrl', 
        'scm', 
        'targetId', 
        'titleColor', 
        'typeTitle'
    ], banners);
    return data;
};

/* 解析歌单数据 */
export const parseSongSheetData = (songSheet: SongSheetData[]) => {
    const data = deconstruction([
        'copywriter',
        'createTime',
        'creator',
        'id',
        'name',
        'picUrl',
        'playcount',
        'trackCount'
    ], songSheet);

    data['creator'] = deconstruction([
        'avatarImgId',
        'avatarUrl',
        'backgroundUrl',
        'description',
        'nickname',
        'signature',
        'userId'
    ], data['creator']);

    return data;
};

/* 解析最新音乐数据 */
export const parseNewSongData = (newSong: NewSongData[]) => {
    const data = deconstruction([
        'canDislike',
        'id',
        'name',
        'picUrl',
        'song'
    ], newSong);

    data.forEach((item, key) => {
        const itemData = data[key];
        itemData.song = deconstruction([
            'artists',
            'duration',
            'id',
            'name'
        ], item.song);
        const artists = itemData.song.artists;
        artists.forEach((item, k) => {
            artists[k] = deconstruction([
                'id', 
                'img1v1Url', 
                'name', 
                'picUrl'
            ], item);
        });
    });
    return data;
};

/* 解析每日推荐音乐数据 */
export const parseRecommendSongs = (songs: RecommendSongsData[]) => {
    const data = deconstruction([
        'al',
        'ar',
        'id',
        'name'
    ], songs);

    return data;
};
