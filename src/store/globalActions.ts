import { BotStruct, GlobalState, UserStruct} from './type.dt'
import { PayloadAction } from '@reduxjs/toolkit'

export const globalActions = {
  setBots: (state: GlobalState, action: PayloadAction<BotStruct[]>) => {
    state.Bots = action.payload
  },
  setBot: (state: GlobalState, action: PayloadAction<BotStruct | null>) => {
    state.Bot = action.payload
  },
  setUser: (state: GlobalState, action: PayloadAction<UserStruct | null>) => {
    state.user = action.payload
  },
  setUsers: (state: GlobalState, action: PayloadAction<UserStruct[]>) => {
    state.users = action.payload
  },
  
}