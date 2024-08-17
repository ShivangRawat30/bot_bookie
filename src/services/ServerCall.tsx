import {store} from "../store"
import{
    BotStruct
} from "../store/type.dt"
import axios from "axios"
import { globalActions } from "../store/globalSlices"
import {toast} from "react-toastify"

const {setBots,setBot} =  globalActions

const getAllBots = async() => {
    try{
        const response = await axios.get(`http://127.0.0.1:4000/api/v1/get/bots`)
        if(!response.data) {
            throw new Error('Failed to fetch Bots')
        }
        console.log(response.data);
        const bots = await response.data
    // store.dispatch(setPlayers(players));
    if (bots.length === 0) {
      return []
    } else {
      console.log('yes')

      store.dispatch(setBots(bots))
      return structuredBots(bots)
    }
    }catch(error){
        console.log(error)
    }
}

const createBot = async() => {
    try{
        const response = await axios.post(`http://127.0.0.1:4000/api/v1/create`);
        await getAllBots();
        toast.success("New Bot Created");
    }
    catch(error){
        toast.error("error occured");
        console.log(error)
    }
}


const structuredBots = (bots: BotStruct[]): BotStruct[] =>
    bots.map((bot) => ({
    publicKey: bot.publicKey,
    privateKey: bot.privateKey,
    gamesPlayed: bot.gamesPlayed,
    gamesWon: bot.gamesWon,
    totalVolume: bot.totalVolume
}))

export {
    getAllBots,
    createBot
}