const express = require("express");
const app = express();
const Bot = require("./models/bot");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const bot = require("./routes/botRoutes");
const { ethers } = require("ethers");
const address = require("./contractAddress.json");
const abi = require("./abi.json");
const axios = require("axios");
const randomColor = require("randomcolor");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
dotenv.config({ path: "./config/config.env" });

const handleLotteryCreated = async (
  status,
  id,
  prize,
  ticketPrice,
  participants,
  winner,
  expiresAt
) => {
  console.log(
    "LotteryCreated event emitted:",
    status,
    id,
    prize,
    ticketPrice,
    participants,
    winner,
    expiresAt
  );
  try {
    await new Promise((resolve) => setTimeout(resolve, 30000));

    const lotteryId = Number(id);
    console.log("fetching Id", lotteryId);
    const players = await axios.get(
      `http://127.0.0.1:4000/api/v1/players/${lotteryId}`
    );
    console.log(players.data);
    const bots = await Bot.find();
    // Create a lookup object for bots
    const botLookup = bots.reduce((lookup, bot) => {
      lookup[bot.publicKey] = bot;
      return lookup;
    }, {});

    // Check for matches
    const matchingBots = players.data.players.filter(
      (player) => botLookup[player.owner]
    ).length;
    console.log("Matching bots:", matchingBots);

    if (matchingBots == 0 && players.data.players.length == 0 ) {
      let start = 1;
      for (let bot of bots) {
        const balance = await provider.getBalance(bot.publicKey);
        if (start === 4 && toWei(balance) < ticketPrice) {
          return;
        }
        const secretKey = bot.privateKey;
        const wallet = new ethers.Wallet(secretKey, provider);
        const contract = new ethers.Contract(address.Bookie, abi, wallet);
        const amount = fromWei(ticketPrice);
        const value = toWei(amount);
        const total = ticketPrice / value;
        const tx = await contract.buyTicket(total, { value });
        await tx.wait();
        console.log("Lottery Entered for ", bot);
        enterLottery(lotteryId, bot.publicKey, amount);
        start++;
      }
    }
    return;
  } catch (error) {
    console.log(error);
  }
};

const enterLottery = async (id, owner, totalAmount) => {
    let color = randomColor();
    const lotteryId = Number(id);
    try {
      await axios.put("http://127.0.0.1:4000/api/v1/lottery/enter", {
        lotteryId,
        owner,
        totalAmount,
        color,
      });
    } catch (error) {
      // console.log(error);
    }
  };

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_PROVIDER);
const wallet = new ethers.Wallet(process.env.SECRET_KEY, provider);

const contract = new ethers.Contract(address.Bookie, abi, wallet);
contract.on("LotteryCreated", handleLotteryCreated);

const toWei = (num) => ethers.parseEther(num.toString());
const fromWei = (num) => ethers.formatEther(num);

app.use("/api/v1", bot);
module.exports = app;
