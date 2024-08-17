import React, { useEffect, useState } from "react";
import { getBalances, sendEthToBot } from "../services/Blockchain";
import { Card } from "flowbite-react";
import { useAccount, useBalance } from "wagmi";
import { ethers } from "ethers";
import { BotStruct } from "../store/type.dt";

const AllBots = ({ bots }) => {
  const { address, isConnected } = useAccount()
  const onTransferEth = async (publicKey: string) => {
    try{
      await sendEthToBot(publicKey);
    }catch(error){
      console.log(error);
    }

  };
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
      <div className="gap-7 w-[full] grid grid-cols-2">
      {bots.map((bot:BotStruct) => (
        <Card className="w-[30vw] flex flex-col items-center justify-center border-2 p-5 m-5" >
          <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
            Bot {bot.publicKey}
          </h5>
          <div className="flex items-baseline text-gray-900 dark:text-white">
            <span className="text-5xl font-extrabold tracking-tight text-black"><span className="text-gray-500 text-xl">Balance   </span>{botBalances[bot.publicKey]}</span>
          </div>
          <ul className="my-7 space-y-5">
            <li className="flex space-x-3">
              
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              
              <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
              <span className="text-black">Address   </span>{bot.publicKey}
              </span>
            </li>
            {/* <li className="flex space-x-3">
              
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              
              <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
              <span className="text-black">Games Won   </span>{bot.gamesWon}
              </span>
            </li>
            <li className="flex space-x-3">
              
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              
              <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
              <span className="text-black">Games Played   </span>{bot.gamesPlayed}
              </span>
            </li>
            <li className="flex space-x-3">
              
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              
              <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
              <span className="text-black">Total Volume   </span>{bot.totalVolume}
              </span>
            </li> */}
            
          </ul>
          <button
            
            type="button"
            onClick={() => onTransferEth(bot.publicKey)}
            className="inline-flex w-[90%] justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-9000"
          >
            Send Eth
          </button>
        </Card>
      ))}
       </div>
    </div>
  );
};

export default AllBots;
