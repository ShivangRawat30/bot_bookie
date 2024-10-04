import React, { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Modal from "react-modal";

import AllBots from "../components/AllBots"; // Import the AllBots component
import { BotStruct, RootState, UserStruct } from "../store/type.dt";
import { createBot, getAllBots, getBotUser, getEthBack } from "../services/ServerCall";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdminBalance,
  getEthBackFromAdmin,
  sendEthToBot,
  sendEthToEveryBot,
} from "../services/Blockchain";
import { globalActions } from "../store/globalSlices";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { getBalance } from "viem/actions";
import AdminCard from "../components/AdminCard";
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

const Home: NextPage = () => {
  const { Bots, users } = useSelector(
    (states: RootState) => states.globalStates
  );
  const [amount, setAmount] = useState("");
  const [botnum, setBotnum] = useState("");
  const [transferOpen, setTransferOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const [adminBalance, setAdminBalance] = useState(0);

  const dispatch = useDispatch();
  const handleOpen = () => {
    setOpen(true);
  };
  console.log(Bots);
  const handleClose = () => setOpen(false);
  const handleTransferOpen = () => {
    setTransferOpen(true);
  };
  const handleTransferClose = () => {
    setTransferOpen(false);
  };

  const { setBots, setBot, setUsers } = globalActions;

  useEffect(() => {
    const fetchBots = async () => {
      const botData = await getBotUser();
      setUsers(botData);
    };
    const AdminBalance = async () => {
      const balance = await getAdminBalance(process.env.ADMIN_ADDRESS);
      setAdminBalance(balance);
    };
    fetchBots();
    AdminBalance();
  }, [getBotUser]);

  const handleCreateNewBot = async (botnum: string) => {
    handleClose();
    const n = Number(botnum);
    await createBot(n);
    const data = await getBotUser();
    setUsers(data);
    toast.success("New Bot Created");
  };

  const onTransferEth = async (publicKey: string) => {
    try {
      handleTransferClose();
      console.log("Hello");
      await sendEthToBot(publicKey, Number(amount));
      toast.success("Eth Transfered");
    } catch (error) {
      toast.error("Someting Went Wrong");
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>BookieBot App</title>
        <meta
          content="This is dedicated to control Bookie Bots"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <div className="h-100% w-100% flex items-center justify-center mt-10">
        {isConnected ? (
          <>
            {address == process.env.OWNER_KEY ? (
              <div className="gap-5 h-auto">
                <div className="h-[65vh] w-[90%] flex flex-col gap-3 ">
                  <button
                    onClick={handleOpen}
                    className="inline-flex w-[60vw] justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-900"
                  >
                    Create New Bot
                  </button>
                  <Modal
                    isOpen={open}
                    onRequestClose={handleClose}
                    style={customStyles}
                  >
                    <div className="h-[20vw] w-[20vw] border-2 gap-10 flex flex-col justify-center items-center rounded-2xl">
                      <div>
                        <h1>Enter Number of Bots to Create</h1>
                      </div>
                      <input
                        type="text"
                        placeholder="Enter Bots you want to create"
                        className="border-2 rounded-xl w-[15vw] h-[40px] border-none bg-gray-200 text-black outline-none text-md pl-7"
                        value={botnum}
                        onChange={(e) => setBotnum(e.target.value)}
                      />
                      <button
                        onClick={() => handleCreateNewBot(botnum)}
                        className="w-[15vw] h-[40px] rounded-xl bg-cyan-600 text-white"
                      >
                        Submit
                      </button>
                    </div>
                  </Modal>
                  <button
                    onClick={handleTransferOpen}
                    className="inline-flex w-[60vw] justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-900"
                  >
                    Send Eth to Admin
                  </button>
                  <Modal
                    isOpen={transferOpen}
                    onRequestClose={handleTransferClose}
                    style={customStyles}
                  >
                    <div className="h-[20vw] w-[20vw] border-2 gap-10 flex flex-col justify-center items-center rounded-2xl">
                      <div>
                        <h1>
                          Amount you want to send to {process.env.ADMIN_ADDRESS}
                        </h1>
                      </div>
                      <input
                        type="text"
                        placeholder="Enter Amount"
                        className="border-2 rounded-xl w-[15vw] h-[40px] border-none bg-gray-200 text-black outline-none text-md pl-7"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      <button
                        onClick={() =>
                          onTransferEth(process.env.ADMIN_ADDRESS ?? "")
                        }
                        className="w-[15vw] h-[40px] rounded-xl bg-cyan-600 text-white"
                      >
                        Send
                      </button>
                    </div>
                  </Modal>
                  <button
                    onClick={getEthBackFromAdmin}
                    className="inline-flex w-[60vw] justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-900"
                  >
                    Get Eth Back from Admin
                  </button>
                  <button
                    onClick={getEthBack}
                    className="inline-flex w-[60vw] justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-900"
                  >
                    Get Eth Back from Bots
                  </button>
                  <div>

                  <AdminCard />
                  </div>
                </div>
                <div>
                {Bots.length > 0 && ( // Conditionally render bot information
                  <AllBots bots={users} /> // Pass bots data to the AllBots component
                )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <h1 className="text-4xl">You are not an authorized user</h1>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center h-[50vh] gap-10">
            <h1 className="text-4xl">
              Please connect your wallet to view and interact with your bots.
            </h1>
            <ConnectButton />
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
