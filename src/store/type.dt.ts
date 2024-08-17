export interface BotStruct {
    publicKey: string,
    privateKey: string,
    gamesPlayed: number,
    gamesWon: number,
    totalVolume: number
}

export interface GlobalState {
    Bots: BotStruct[]
    Bot: BotStruct | null
}

export interface RootState{
    globalStates: GlobalState
}