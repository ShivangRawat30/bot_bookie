import { ethers } from "ethers";
import { toast } from "react-toastify";
import { BotStruct, UserStruct } from "../store/type.dt";

const toWei = (num: number) => ethers.parseEther(num.toString());
const fromWei = (num: number) => ethers.formatEther(num);

let ethereum: any;
let tx: any;

if (typeof window !== "undefined") ethereum = window.ethereum;

const getEthereumWallet = async () => {
      const provider = new ethers.BrowserProvider(ethereum)
  const signer = await provider.getSigner();
  return signer;
};

const sendEthToBot = async (publickKey: string, eth: number) => {
  try {
    console.log("new hello");
    const amount = toWei(eth);
    const signer = await getEthereumWallet();
    console.log(amount);
    const tx = await signer.sendTransaction({
      to: publickKey,
      value: amount,
    });
    await tx.wait();
    toast.success("Transfer Successfull");
  } catch (error) {
    toast.error("Error Occured");
  }
};

const sendEthToEveryBot = async (bots: BotStruct[], val: number) => {
  try {
    console.log(bots);
    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_PROVIDER);
    // const provider = 'https://rpc-amoy.polygon.technology/';
    const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
    const amount = toWei(val);
    for (const bot of bots) {
      await wallet.sendTransaction({
        to: bot.publicKey,
        value: amount,
      });
    }
    console.log("Eth send successfully")
    toast.success("Transfer Successful");
  } catch (error) {
    toast.error("Error Occurred");
  }
};

const getBalances = async (bots: UserStruct[]) => {
      const provider = new ethers.BrowserProvider(ethereum)
  const balances = await Promise.all(
    bots.map(async (bot) => {
      const balance = await provider.getBalance(bot.owner);
      return {
        publicKey: bot.owner,
        balance: fromWei(balance),
      };
    })
  );
  // console.log(balances)
  return balances.reduce(
    (acc, bot) => ({ ...acc, [bot.publicKey]: bot.balance }),
    {}
  );
};

const getAdminBalance = async (address: string) => {
      const provider = new ethers.BrowserProvider(ethereum)
  const balance = await provider.getBalance(address);
  return fromWei(balance);
};

const getEthBackFromAdmin = async () => {
  try {
        const provider = new ethers.BrowserProvider(ethereum)
    const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
    const balance = await provider.getBalance(process.env.ADMIN_ADDRESS);
    const transferAmount = balance - toWei(0.0002);
    const tx = await wallet.sendTransaction({
      to: process.env.OWNER_KEY,
      value: transferAmount,
    });
    await tx.wait();
  } catch (error) {
    console.log(error);
  }
};

export {
  sendEthToBot,
  getBalances,
  sendEthToEveryBot,
  getAdminBalance,
  getEthBackFromAdmin,
};
