const Bot = require("../models/bot");
const { ethers } = require("ethers");
const CryptoJS = require("crypto-js");
const address = require("../contractAddress.json");
const randomColor = require("randomcolor");
const axios = require("axios");
const abi = require("../abi.json");
const {
  generateFromEmail,
  uniqueUsernameGenerator,
} = require("unique-username-generator");
const { confluxESpace } = require("viem/chains");
const crypto = require("crypto");
const config = require('./config');

function encryptPrivateKey(privateKey, password) {
  const salt = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([cipher.update(privateKey), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    encrypted: encrypted.toString("hex"),
  };
}

function decryptPrivateKey(encryptedData, password) {
  const salt = Buffer.from(encryptedData.iv, "hex");
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");
  const iv = Buffer.from(encryptedData.iv, "hex");

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const decrypted = Buffer.concat([
    decipher.update(encryptedData.encrypted, "hex"),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}



const botController = {};

botController.createBot = async (req, res) => {
  try {
    const wallet = ethers.Wallet.createRandom();

    const passphrase = process.env.PASSPHRASE;

    const encryptedPrivateKey = encryptPrivateKey(
      wallet.privateKey,
      passphrase
    );
    console.log(encryptedPrivateKey);

    const storedWallet = {
      publicKey: wallet.address,
      privateKey: wallet.privateKey,
      iv: encryptedPrivateKey.iv,
    };

    const newBot = new Bot(storedWallet);
    await newBot.save();
    await createUser(wallet.address);

    res.status(201).json({ message: "Bot created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};
const createUser = async (owner) => {
  try {
    console.log("Creating user");
    const name = uniqueUsernameGenerator(config);
    const response = await axios.post("http://127.0.0.1:4000/api/v1/create", {
      name,
      owner,
    });
  } catch (error) {
    console.log(error);
  }
};


// Function to get all bots
botController.getAllBots = async (req, res) => {
  try {
    const bots = await Bot.find({});

    res.status(200).json(bots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving bots" });
  }
};

// Function to get a single bot by ID
botController.getBotById = async (req, res) => {
  try {
    const bot = await Bot.findOne({ publicKey: req.params.id });

    if (!bot) {
      return res.status(404).json({ message: "Bot not found" });
    }

    res.status(200).json(bot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving bot" });
  }
};

const ownerContract = async () => {
  const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_PROVIDER);
  const wallet = new ethers.Wallet(process.env.SECRET_KEY, provider);

  const contract = new ethers.Contract(address.Bookie, abi, wallet);
  return contract;
};

botController.enterLotteries = async (req, res) => {
  try {
    const { publicKey, max } = req.params;
    console.log(publicKey, max);
    const contract = await ownerContract();
    let number = 1;
    const handleLotteryCreatedPromise = (publicKey, id) =>
      new Promise((resolve) => {
        contract.once(
          "LotteryCreated",
          async (
            status,
            id,
            prize,
            ticketPrice,
            participants,
            winner,
            expiresAt
          ) => {
            await handleLotteryCreated(publicKey, id);
            resolve();
          }
        );
      });

    while (number <= max) {
      await handleLotteryCreatedPromise(publicKey);
      number++;
    }
  } catch (error) {
    await Bot.findOneAndUpdate(
      { publicKey },
      {
        currentlyWorking: false,
      },
      { new: true }
    );
    console.error(error);
    res.status(500).json({ message: "Error Executing Task" });
  }
};

function getRandomValueWithWeights() {
  const values = [0.01, 0.0001, 0.001];
  const probabilities = [0.1, 0.001, 0.01];
  const sumOfProbabilities = probabilities.reduce((acc, prob) => acc + prob, 0);

  const randomNum = Math.random() * sumOfProbabilities;

  let cumulativeProb = 0;
  for (let i = 0; i < values.length; i++) {
    cumulativeProb += probabilities[i];
    if (randomNum <= cumulativeProb) {
      return values[i];
    }
  }
}

function getRandomNumber(min, max) {
  const range = max - min + 1;
  return Math.floor(Math.random() * range) + min;
}

const handleLotteryCreated = async (publicKey, id) => {
  console.log(publicKey);
  try {
    const timeInterval = getRandomNumber(1, 60) * 1000;
    await new Promise((resolve) => setTimeout(resolve, timeInterval));
    const bot = await Bot.findOne({ publicKey });
    console.log(bot);
    const val = {
      encrypted: bot.privateKey,
      iv: bot.iv,
    };
    const passphrase = process.env.PASSPHRASE;
    // enter blockchain lottery
    // const secretKey = decryptPrivateKey(val, passphrase)
    const secretKey = bot.privateKey;

    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_PROVIDER);
    const wallet = new ethers.Wallet(secretKey, provider);
    const contract = new ethers.Contract(address.Bookie, abi, wallet);
    const value = toWei(getRandomValueWithWeights());
    const total = 1;
    const tx = await contract.buyTicket(total, { value });
    await tx.wait();
    console.log("Lottery Entered");
    // enter web2 lottery
    const amount = 0.0001;
    enterLottery(id, publicKey, amount);
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
    console.log(error);
  }
};

botController.updateBot = async (req, res) => {
  try {
    const { isWorking, pubKey } = req.params;
    await Bot.findOneAndUpdate(
      { pubKey },
      {
        currentlyWorking: isWorking,
      },
      { new: true }
    );

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error Executing Task" });
  }
};

const toWei = (num) => ethers.parseEther(num.toString());
const fromWei = (num) => ethers.formatEther(num);

botController.sendEthBack = async (req, res) => {
  try {
    const { pubKey, userKey } = req.params;
    console.log(pubKey, userKey);
    const bot = await Bot.findOne({ publicKey: pubKey });

    const secretKey = bot.privateKey;

    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_PROVIDER);
    const wallet = new ethers.Wallet(secretKey, provider);

    const balance = await provider.getBalance(pubKey);
    console.log(balance);
    const transferAmount = balance - toWei(0.001);
    const tx = await wallet.sendTransaction({
      to: userKey,
      value: transferAmount,
    });
    console.log("Transaction sent:", tx.hash);

    res.status(200).json({ message: "ETH sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error Executing Task" });
  }
};



module.exports = botController;
