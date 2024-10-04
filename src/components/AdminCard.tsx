import { useEffect, useState } from "react";
import Modal from "react-modal";
import { getAdminBalance, sendEthToBot, sendEthToEveryBot } from "../services/Blockchain";
import { toast } from "react-toastify";
import { enterBotLotttery, getAllBots } from "../services/ServerCall";

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
const AdminCard = () => {
  const [amount, setAmount] = useState("");
  const [round, setRound] = useState("");
  const [adminBalance, setAdminBalance] = useState(0);
  const [transferOpen, setTransferOpen] = useState(false);
  const [roundOpen, setRoundOpen] = useState(false);
  const handleTransferOpen = () => {
    setTransferOpen(true);
  };
  const handleTransferClose = () => {
    setTransferOpen(false);
  };
   const handleRoundsOpen = () => {
    setRoundOpen(true);
   }
   const handleRoundClose = () => {
    setRoundOpen(false);
   }

  const onTransferEth = async () => {
    try {
      handleTransferClose();
      const bots = await getAllBots();
      console.log(bots);
      await sendEthToEveryBot(bots, Number(amount));
      toast.success("Eth Transfered");
    } catch (error) {
      toast.error("Someting Went Wrong");
      console.log(error);
    }
  };

  const enterLotteries = async() => {
    try{
      handleRoundClose();
      await enterBotLotttery(Number(round));


    } catch(error){
      toast.error("Something Went Wrong");
      console.log(error);
    }
  }

  useEffect(() => {
    const AdminBalance = async () => {
      const balance = await getAdminBalance(process.env.ADMIN_ADDRESS);
      setAdminBalance(Number(balance));
    };
    AdminBalance();
  }, []);

  return (
    <div className="w-full h-[30vh]">
      <div className="w-[60vw] h-[30vh] border-2 p-5 items-center justify-center flex flex-col gap-3">
        <h1 className="text-3xl font-black">Admin Control</h1>
        <div className="flex gap-10">
          <h1 className="text-xl font-black">Admin Address</h1>
          <h1 className="text-xl">{process.env.ADMIN_ADDRESS}</h1>
        </div>
        <div className="flex gap-10">
          <h1 className="text-xl font-black">Current Balance</h1>
          <h1 className="text-xl">{adminBalance}</h1>
        </div>

        <button
          type="button"
          onClick={handleTransferOpen}
          className="inline-flex w-[90%] justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-9000"
        >
          Send Eth to bots
        </button>
        <Modal
          isOpen={transferOpen}
          onRequestClose={handleTransferClose}
          style={customStyles}
        >
          <div className="h-[20vw] w-[20vw] border-2 gap-10 flex flex-col justify-center items-center rounded-2xl">
            <div>
              <h1>Amount you want to send to every bot</h1>
            </div>
            <input
              type="text"
              placeholder="Enter Amount"
              className="border-2 rounded-xl w-[15vw] h-[40px] border-none bg-gray-200 text-black outline-none text-md pl-7"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              onClick={() => onTransferEth()}
              className="w-[15vw] h-[40px] rounded-xl bg-cyan-600 text-white"
            >
              Send
            </button>
          </div>
        </Modal>

        <button
          type="button"
          onClick={handleRoundsOpen}
          className="inline-flex w-[90%] justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-9000"
        >
          Enter Lottery
        </button>
        <Modal
          isOpen={roundOpen}
          onRequestClose={handleRoundClose}
          style={customStyles}
        >
          <div className="h-[20vw] w-[20vw] border-2 gap-10 flex flex-col justify-center items-center rounded-2xl">
            <div>
              <h1>Number of Rounds you want to Enter</h1>
            </div>
            <input
              type="text"
              placeholder="Enter Lottery Rounds"
              className="border-2 rounded-xl w-[15vw] h-[40px] border-none bg-gray-200 text-black outline-none text-md pl-7"
              value={round}
              onChange={(e) => setRound(e.target.value)}
            />
            <button
              onClick={() => enterLotteries()}
              className="w-[15vw] h-[40px] rounded-xl bg-cyan-600 text-white"
            >
              Send
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminCard;
