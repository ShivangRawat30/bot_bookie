export interface BotStruct {
    publicKey: string,
    privateKey: string,
    gamesPlayed: number,
    gamesWon: number,
    totalVolume: number
}
export interface UserStruct {
    name: string
    owner: string
    totalLotteryPlayed: number
    totalWins: number
    totalAmount: number
    totalWinAmount: number
    totalPoints: number
    oneDayData: {
      lotteryPlayed: number
      wins: number
      amount: number
      winAmount: number
    }
    referCode: string
    referCodeUsed: boolean
  }

export interface GlobalState {
    Bots: BotStruct[]
    Bot: BotStruct | null
    user: UserStruct | null
    users: UserStruct[]
}

export interface RootState{
    globalStates: GlobalState
}