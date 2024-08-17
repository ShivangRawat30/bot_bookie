import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import { BotStruct } from '../store/type.dt'

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

const sendEthToBot = async(publickKey: string) => {
    try{
        const amount = toWei(0.00001);
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

const sendEthToEveryBot = async (bots: BotStruct[]) => {
    try {
        for (const bot of bots) {
            const amount = toWei(0.00001);
            const tx = {
                to: bot.publicKey,
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

const getBalances = async(bots: BotStruct[]) => {
    const provider = new ethers.BrowserProvider(ethereum)
    const balances = await Promise.all(
        bots.map(async (bot) => {
          const balance = await provider.getBalance(bot.publicKey);
          return {
            publicKey: bot.publicKey,
            balance: fromWei(balance)
          };
        })
    );
    console.log(balances)
      return (balances.reduce((acc, bot) => ({ ...acc, [bot.publicKey]: bot.balance }), {}));;
}
export{
    sendEthToBot,
    getBalances,
    sendEthToEveryBot
}