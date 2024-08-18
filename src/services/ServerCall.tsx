import {store} from "../store"
import{
    BotStruct,
    UserStruct
} from "../store/type.dt"
import axios from "axios"
import { globalActions } from "../store/globalSlices"
import {toast} from "react-toastify"

const {setBots,setBot,setUsers} =  globalActions

const getAllBots = async() => {
    try{
        const response = await axios.get(`http://127.0.0.1:4001/api/v1/get/bots`)
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

const getBotUser = async() => {
    try{
        const botsData = await getAllBots();
        const pubKeyArray = botsData.map(bot => bot.publicKey);
        console.log(pubKeyArray);
        const response = await axios.post("http://127.0.0.1:4000/api/v1/get/array/users",
            {pubKeyArray}
        );
        const users = await response.data;
        if(!users) {
            throw new Error('Failed to fetch Bot user')
        }
        const structUsers = structuredUsers(users);
        store.dispatch(setUsers(structUsers));
        console.log(structUsers);
        return structUsers
    }
    catch(error){
        toast.error("error occured");
        console.log(error)
    }
}

const createBot = async() => {
    try{
        const response = await axios.post(`http://127.0.0.1:4001/api/v1/create`);
        await getAllBots();
        toast.success("New Bot Created");
    }
    catch(error){
        toast.error("error occured");
        console.log(error)
    }
}

const enterBotLotttery = async(publicKey:string, max: number) => {
    try{
        const response = await axios.post(`http://127.0.0.1:4001/api/v1/enter/${publicKey}/${max}`);
        toast.success('Bot Work assigned');
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

const structuredUsers = (users: UserStruct[]): UserStruct[] =>
    users.map((user) => ({
      name: user.name,
      owner: user.owner,
      totalLotteryPlayed: Number(user.totalLotteryPlayed),
      totalWins: Number(user.totalWins),
      totalAmount: Number(user.totalAmount),
      totalWinAmount: Number(user.totalWinAmount),
      totalPoints: user.totalPoints,
      oneDayData: {
        lotteryPlayed: user.oneDayData.lotteryPlayed,
        wins: user.oneDayData.wins,
        amount: user.oneDayData.amount,
        winAmount: user.oneDayData.winAmount,
      },
      referCode: user.referCode,
      referCodeUsed: user.referCodeUsed,
    }))

export {
    getAllBots,
    createBot,
    getBotUser,
    enterBotLotttery
}