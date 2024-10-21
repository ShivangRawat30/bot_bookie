import { ethers } from "ethers";
import { toast } from "react-toastify";
import { BotStruct, UserStruct } from "../store/type.dt";
import address from "../../server/contractAddress.json";
import abi from "../../server/abi.json";
import {addAmountSpent} from "./ServerCall";


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

const getEthereumContracts = async () => {
  const provider = new ethers.BrowserProvider(ethereum)
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(address.Bookie, abi, signer)
  return contract
}

const getOwnerContract = () => {
  const privateKey = process.env.ADMIN_PRIVATE_KEY
  const wallet = new ethers.Wallet(privateKey);
  const provider = new ethers.BrowserProvider(ethereum)
  const signer = wallet.connect(provider)
  
  const contract = new ethers.Contract(address.Bookie, abi, signer)
  return contract
}


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
    addAmountSpent(eth);
  } catch (error) {
    toast.error("Error Occured");
  }
};

const getBookieTotalVol = async() => {
    const contract = getOwnerContract();
    const totalVolume = await contract.getBookieTotalAmount();
    console.log(totalVolume);
    const returnValue = fromWei(totalVolume); 
    return returnValue;
}

const getOwnerEarning = async() => {
  const contract = getOwnerContract();
  const ownerEarning = await contract.getOwnerEarning();
  console.log(ownerEarning);
  return fromWei(ownerEarning);
}

const sendEthToEveryBot = async (bots: BotStruct[], val: number) => {
  try {
    console.log(bots);
    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_PROVIDER);
    console.log(process.env.ALCHEMY_PROVIDER);
    const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
    const amount = toWei(val) // Assuming val is in Ether

    for (const bot of bots) {
      await wallet.sendTransaction({
        to: bot.publicKey,
        value: amount,
      });
    }
    console.log("Eth sent successfully");
    toast.success("Transfer Successful");
  } catch (error) {
    console.error("Error sending Eth:", error);
    // Consider throwing a more specific error or handling it differently
  }
};

const getBalances = async (bots: UserStruct[]) => {
      const provider = new ethers.BrowserProvider(ethereum)
  const balances = await Promise.all(
    bots.map(async (bot) => {
      const balance = await provider.getBalance(bot.owner);
      const fixedBalance = Number.parseFloat(fromWei(balance)).toFixed(6);
      return {
        publicKey: bot.owner,
        balance: fixedBalance,
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
  getBookieTotalVol,
  getOwnerEarning
};
