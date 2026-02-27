// 定数などの宣言用ファイル

// valorantのランク一覧
enum valorantRanks {
    UnRanked = 0,
    Iron1 = 1,
    Iron2 = 2,
    Iron3 = 3,
    Bronze1 = 4,
    Bronze2 = 5,
    Bronze3 = 6,
    Silver1 = 7,
    Silver2 = 8,
    Silver3 = 9,
    Gold1 = 10,
    Gold2 = 11,
    Gold3 = 12,
    Platinum1 = 13,
    Platinum2 = 14,
    Platinum3 = 15,
    Ascendant1 = 16,
    Ascendant2 = 17,
    Ascendant3 = 18,
    Immortal1 = 19,
    Immortal2 = 20,
    Immortal3 = 21,
    Radiant = 22
}

// LoLのランク一覧
enum LoLRanks {
    UnRanked = 0,
    Iron4 = 1,
    Iron3 = 2,
    Iron2 = 3,
    Iron1 = 4,
    Bronze4 = 5,
    Bronze3 = 6,
    Bronze2 = 7,
    Bronze1 = 8,
    Silver4 = 9,
    Silver3 = 10,
    Silver2 = 11,
    Silver1 = 12,
    Gold4 = 13,
    Gold3 = 14,
    Gold2 = 15,
    Gold1 = 16,
    Platinum4 = 17,
    Platinum3 = 18,
    Platinum2 = 19,
    Platinum1 = 20,
    Diamond4 = 21,
    Diamond3 = 22,
    Diamond2 = 23,
    Diamond1 = 24,
    Master = 25,
    Grandmaster = 26,
    Challenger = 27
}

// ストリートファイターのランク
enum streetFighterRanks {
    Rookie = 0,
    Iron1 = 1,
    Iron2 = 2,
    Iron3 = 3,
    Iron4 = 4,
    Iron5 = 5,
    Bronze5 = 6,
    Bronze4 = 7,
    Bronze3 = 8,
    Bronze2 = 9,
    Bronze1 = 10,
    Silver1 = 11,
    Silver2 = 12,
    Silver3 = 13,
    Silver4 = 14,
    Silver5 = 15,
    Gold1 = 16,
    Gold2 = 17,
    Gold3 = 18,
    Gold4 = 19,
    Gold5 = 20,
    Platinum1 = 21,
    Platinum2 = 22,
    Platinum3 = 23,
    Platinum4 = 24,
    Platinum5 = 25,
    Diamond1 = 26,
    Diamond2 = 27,
    Diamond3 = 28,
    Diamond4 = 29,
    Diamond5 = 30,
    Master = 31,
    HighMaster = 32,
    GrandMaster = 33,
    UltimateMaster = 34,
    Legend = 35
}

enum ApexRanks {
    Rookie = 0,
    Iron1 = 1,
    Iron2 = 2,
    Iron3 = 3,
    Bronze1 = 4,
    Bronze2 = 5,
    Bronze3 = 6,
    Silver1 = 7,
    Silver2 = 8,
    Silver3 = 9,
    Gold1 = 10,
    Gold2 = 11,
    Gold3 = 12,
    Platinum1 = 13,
    Platinum2 = 14,
    Platinum3 = 15,
    Diamond1 = 16,
    Diamond2 = 17,
    Diamond3 = 18,
    Master = 19,
    Predator = 20
}

// ゲーム名の表記を修正
export function gameNameFixed(name: string) {

    switch (name) {
        case "Valo":
        case "valorant":
        case "Valorant":
        case "VALORANT":
        case "VALO":
        case "valo":
        case "ヴァロラント":
        case "ヴァロ":
        case "バロラント":
        case "バロ":
        case "バアロ":
            return "VALORANT";
        case "LoL":
        case "lol":
        case "LOL":
        case "リーグオブレジェンド":
        case "リーグ・オブ・レジェンド":
            return "League of Legends";
        case "Apex":
        case "APEX":
        case "apex":
        case "Apex Legends":
        case "apex legends":
        case "APEX LEGENDS":
        case "エーペックス":
        case "エペ":
        case "エイペックス":
            return "Apex Legends"
        case "OW":
        case "ow":
        case "OW2":
        case "ow2":
        case "オーバーウォッチ2":
        case "オーバーウォッチ":
            return "OverWatch 2";
        case "SF6":
        case "sf6":
        case "SF":
        case "sf":
        case "ストリートファイター6":
        case "ストリートファイター":
        case "スト6":
            return "Street Fighter VI";
        default:
            return name;
    }
}

// サポートしているゲーム一覧
export const supportedGames = {
    valo: "VALORANT",
    LoL: "League of Legends",
    Apex: "Apex Legends",
    OW: "OverWatch 2",
    SF: "Street Fighter VI"
};

// サポートしているゲームの型指定
export const supportedGamesMap = (game: string) => {

    switch (gameNameFixed(game)) {
        case supportedGames.valo:
            return Object.entries(valorantRanks).map(([key, value]) => ({ key, value }));
        case supportedGames.LoL:
            return Object.entries(LoLRanks).map(([key, value]) => ({ key, value }));
        case supportedGames.SF:
            return Object.entries(streetFighterRanks).map(([key, value]) => ({ key, value }));
        case supportedGames.Apex:
            return Object.entries(ApexRanks).map(([key, value]) => ({ key, value }));
    }
}