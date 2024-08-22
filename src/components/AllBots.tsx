import React, { useEffect, useState } from "react";
import { getBalances, sendEthToBot } from "../services/Blockchain";
import { Card } from "flowbite-react";
import { useAccount, useBalance } from "wagmi";
import { ethers } from "ethers";
import { BotStruct, RootState, UserStruct } from "../store/type.dt";
import { globalActions } from "../store/globalSlices";
import { toast } from "react-toastify";
import { enterBotLotttery, getBotUser, getEthBack, updateBot } from "../services/ServerCall";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    // backgroundColor: '#0F0F14',
    borderRadius: "20px",
    border: "4px",
  },
  overlay: {
    // backgroundColor: 'rgba(0, 0, 0, 0.75)',
    // backdropFilter: 'blur(1px)',
  },
};
const AllBots = ({ bots }) => {
  const { Bots,user } = useSelector((states: RootState) => states.globalStates)
  const { setUser } = globalActions
  const dispatch = useDispatch();
  const { address, isConnected } = useAccount();
  const [rounds, setRounds] = useState("");
  const [amount,setAmount] = useState("");
  const [transferOpen, setTransferOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = (oneBot:UserStruct) => {
    setOpen(true)
    dispatch(setUser(oneBot))
  };
  console.log(Bots);
  const handleClose = () => setOpen(false);

  const handleTransferOpen = (oneBot: UserStruct) => {
    setTransferOpen(true);
    dispatch(setUser(oneBot))
  }
  const handleTransferClose = () => {
    setTransferOpen(false);
  }

  const onTransferEth = async (publicKey: string) => {
    try {
      await sendEthToBot(publicKey, parseInt(amount));
      const data = await getBalances(bots);
      setBotBalances(data);
      toast.success("Eth Transfered");
    } catch (error) {
      toast.error("Someting Went Wrong");
      console.log(error);
    }
  };
  const handleEnterLottery = async (publicKey: string) => {
    try {
      handleClose();
      await updateBot(publicKey,true);
      await enterBotLotttery(publicKey, parseInt(rounds));
      await updateBot(publicKey,false);
      const data = await getBalances(bots);
      setBotBalances(data);
      await getBotUser();
      toast.success("Task Assigned");
    } catch (error) {
      await updateBot(publicKey,false);
      toast.error("Someting Went Wrong");
      console.log(error);
    }
  };
  const getEth = async(pubKey: string) => {
    try{
      if(address){
        await getEthBack(pubKey,address);
        const data = await getBalances(bots);
        setBotBalances(data);
      }
    }
    catch (error) {
      toast.error("Someting Went Wrong");
      console.log(error);
    }
  }
  const [botBalances, setBotBalances] = useState({});

  useEffect(() => {
    const fetchBalances = async () => {
      const data = await getBalances(bots);
      setBotBalances(data);
    };
    fetchBalances();
  }, [bots]);

  return (
    <div className="text-black">
      {bots ? (
        <div className="gap-7 w-[full] grid grid-cols-2">
          {bots.map((bot: UserStruct) => (
            <Card key={bot.owner} className="w-[30vw] flex flex-col items-center justify-center border-2 p-5 m-5">
              <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
                {bot.name}
              </h5>
              <div className="flex items-baseline text-gray-900 dark:text-white">
                <span className="text-3xl font-extrabold tracking-tight text-black">
                  <span className="text-gray-500 text-xl">Balance </span>
                  {botBalances[bot.owner]}
                </span>
              </div>
              <ul className="my-7 space-y-5">
                <li className="flex space-x-3">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />

                  <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                    <span className="text-black">Address   </span>
                    {bot.owner}
                  </span>
                </li>
                <li className="flex space-x-3">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                  <div className="w-[100%] flex justify-between ">
                    <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                      <span className="text-black">Wins </span>
                      {bot.totalWins}
                    </span>
                    <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                      <span className="text-black">Amount Spent </span>
                      {bot.totalAmount}
                    </span>
                    <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                      <span className="text-black">Points </span>
                      {bot.totalPoints}
                    </span>
                  </div>
                </li>
                <li className="flex space-x-3">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />

                  <div className="w-[100%] flex justify-between ">
                    <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                      <span className="text-black">lottery Played </span>
                      {bot.totalLotteryPlayed}
                    </span>
                    <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                      <span className="text-black">Lottery Won </span>
                      {bot.totalWins}
                    </span>
                    <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                      <span className="text-black">Win Amount </span>
                      {bot.totalWinAmount}
                    </span>
                  </div>
                </li>
              </ul>
              <div className="h-[15vh] flex flex-col justify-between">
                <button
                  type="button"
                  onClick={() => handleTransferOpen(bot)}
                  className="inline-flex w-[90%] justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-9000"
                >
                  Send Eth
                </button>
                <Modal
                  isOpen={transferOpen}
                  onRequestClose={handleTransferClose}
                  style={customStyles}
                >
                  <div className="h-[20vw] w-[20vw] border-2 gap-10 flex flex-col justify-center items-center rounded-2xl">
                    <div>
                      <h1>Amount you want to send to {user?.name}</h1>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter Amount"
                      className="border-2 rounded-xl w-[15vw] h-[40px] border-none bg-gray-200 text-black outline-none text-md pl-7"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <button onClick={() => onTransferEth(user?.owner ?? '')} className="w-[15vw] h-[40px] rounded-xl bg-cyan-600 text-white">Send</button>
                  </div>
                </Modal>
                {!Bots.find((b) => b.publicKey === bot.owner)?.currentlyWorking && (
                  <button
                    type="button"
                    onClick={() => handleOpen(bot)}
                    className="inline-flex w-[90%] justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-9000"
                  >
                    Enter Lottery
                  </button>
                )}
                <Modal
                  isOpen={open}
                  onRequestClose={handleClose}
                  style={customStyles}
                >
                  <div className="h-[20vw] w-[20vw] border-2 gap-10 flex flex-col justify-center items-center rounded-2xl">
                    <div>
                      <h1>Enter Number of Rounds for {user?.name}</h1>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter A Number"
                      className="border-2 rounded-xl w-[15vw] h-[40px] border-none bg-gray-200 text-black outline-none text-md pl-7"
                      value={rounds}
                      onChange={(e) => setRounds(e.target.value)}
                    />
                    <button onClick={() => handleEnterLottery(user?.owner ?? '')} className="w-[15vw] h-[40px] rounded-xl bg-cyan-600 text-white">Submit</button>
                  </div>
                </Modal>
                <button
                  type="button"
                  onClick={() => getEth(bot?.owner ?? '')}
                  className="inline-flex w-[90%] justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-9000"
                >
                  Get Eth Back from {bot.name}
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div>No Bot Data</div>
      )}
    </div>
  );
};

export default AllBots;
