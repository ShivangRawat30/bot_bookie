import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import { BotStruct, UserStruct } from '../store/type.dt'

const toWei = (num: number) => ethers.parseEther(num.toString())
const fromWei = (num: number) => ethers.formatEther(num)

let ethereum: any
let tx: any

if (typeof window !== 'undefined') ethereum = window.ethereum

const getEthereumWallet = async() => {
    const provider = new ethers.BrowserProvider(ethereum)
    const signer = await provider.getSigner();
    return signer;
}

const sendEthToBot = async(publickKey: string, eth: number) => {
    try{
        const amount = toWei(eth);
        const signer = await getEthereumWallet();
        const tx = await signer.sendTransaction({
            to: publickKey,
            value: amount,
          });
          await tx.wait();
    toast.success("Transfer Successfull");

    }catch(error){
        toast.error("Error Occured")
    }
}

const sendEthToEveryBot = async (bots: UserStruct[]) => {
    try {
        for (const bot of bots) {
            const amount = toWei(0.00001);
            const tx = {
                to: bot.owner,
                value: amount,
            };

            const signer = await getEthereumWallet();
            const finalTx = await signer.sendTransaction(tx);
            await finalTx.wait();
        }
        toast.success("Transfer Successful");
    } catch (error) {
        toast.error("Error Occurred");
    }
};

const getBalances = async(bots: UserStruct[]) => {
    const provider = new ethers.BrowserProvider(ethereum)
    const balances = await Promise.all(
        bots.map(async (bot) => {
          const balance = await provider.getBalance(bot.owner);
          return {
            publicKey: bot.owner,
            balance: fromWei(balance)
          };
        })
    );
    // console.log(balances)
      return (balances.reduce((acc, bot) => ({ ...acc, [bot.publicKey]: bot.balance }), {}));;
}

export{
    sendEthToBot,
    getBalances,
    sendEthToEveryBot
}