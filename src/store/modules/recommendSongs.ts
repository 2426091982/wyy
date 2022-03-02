import { 
    day,
    now, 
    setItem 
} from "@/utils";
import { RecommendSongs } from "../types/recommendSongs";

const recommendSongs: RecommendSongs = {
    namespaced: true,
    state: {
        songs: [],
    },
    mutations: {
        change(state, value) {
            state.songs = value;
            const data = {
                songs: value,
                setTime: now(),
                day: day(),
            };
            setItem('recommend-songs', data);
        },
    },
};

export default recommendSongs;
