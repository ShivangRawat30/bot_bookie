import { BotStruct, GlobalState} from './type.dt'
import { PayloadAction } from '@reduxjs/toolkit'

export const globalActions = {
  setBots: (state: GlobalState, action: PayloadAction<BotStruct[]>) => {
    state.Bots = action.payload
  },
  setBot: (state: GlobalState, action: PayloadAction<BotStruct | null>) => {
    state.Bot = action.payload
  },
  
}