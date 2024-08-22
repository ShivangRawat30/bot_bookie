import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

import AllBots from '../components/AllBots'; // Import the AllBots component
import { BotStruct, RootState } from '../store/type.dt';
import { createBot, getAllBots, getBotUser } from "../services/ServerCall";
import { useDispatch, useSelector } from 'react-redux';
import { sendEthToEveryBot } from '../services/Blockchain';
import { globalActions } from '../store/globalSlices';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';

const Home: NextPage = () => {
  const { Bots, users } = useSelector((states: RootState) => states.globalStates);
  const { address, isConnected } = useAccount();

  const dispatch = useDispatch();

  const { setBots, setBot, setUsers } = globalActions;

  useEffect(() => {
    const fetchBots = async () => {
      const botData = await getBotUser();
      setUsers(botData);
    };
    fetchBots();
  }, [getBotUser]);

  const handleCreateNewBot = async () => {
    await createBot();
    const data = await getBotUser();
    setUsers(data);
    toast.success("New Bot Created");
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>BookieBot App</title>
        <meta
          content="This is dedicated to control Bookie Bots"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <div className={styles.main}>
        {isConnected ? (
        <> 
          {
            address == process.env.OWNER_KEY 
            ? (
            <div className='gap-5 h-auto'>
            <div className='h-[15vh] w-[100%] flex flex-col gap-5 '>
            <button
            onClick={handleCreateNewBot}
            className='inline-flex w-[90%] justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-900'
            >
            Create New Bot
            </button>
            </div>
            {Bots.length > 0 && ( // Conditionally render bot information
              <AllBots bots={users} /> // Pass bots data to the AllBots component
            )}
            </div>
        ): (
          <div className='flex flex-col items-center'>
          <p className='text-4xl'>You are not an authorized user</p>
        </div>
        )
      }
      </>
        ) : (
          <div className='flex flex-col items-center h-[50vh] gap-10'>
            <p className='text-4xl'>Please connect your wallet to view and interact with your bots.</p>
            <ConnectButton />
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <a href="https://rainbow.me" rel="noopener noreferrer" target="_blank">
          Made with ❤️ by Shivang
        </a>
      </footer>
    </div>
  );
};

export default Home;