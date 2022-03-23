import { Response } from "./base";
import { SongSheetData } from "@/store/types/songSheet";

export type HighqualitySheetData = Response & { playlists: SongSheetData[], lasttime: number, total: number };
export type PlainSongSheetData = Response & { playlists: SongSheetData[], total: number };
