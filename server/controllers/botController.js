const Bot = require("../models/bot");
const { ethers } = require("ethers");
const CryptoJS = require("crypto-js");
const address = require("../contractAddress.json");
const randomColor = require("randomcolor");
const axios = require("axios");
const abi = require('../abi.json')
const { generateFromEmail, uniqueUsernameGenerator } = require("unique-username-generator");

const superCharacters = ["Solarion", "Terraformer","Superman", "Batman", "Wonder Woman", "The Flash", "Green Lantern", "Aquaman", "Martian Manhunter", "Cyborg", "Green Arrow", "Hawkgirl", "Nightwing", "Batgirl", "Supergirl", "Shazam", "Booster Gold", "Blue Beetle", "Firestorm", "Atom", "Black Canary", "Zatanna", "Plastic Man", "Elongated Man", "Vixen", "Captain Marvel", "Doctor Fate", "Deadman", "Swamp Thing", "Animal Man", "Starfire", "Raven","Lex Luthor", "The Joker", "Brainiac", "Sinestro", "Black Manta", "Cheetah", "Darkseid", "Doomsday", "Deathstroke", "Reverse-Flash", "Captain Cold", "Heat Wave", "Gorilla Grodd", "Poison Ivy", "Scarecrow", "Bane", "Harley Quinn", "Two-Face", "Penguin", "Riddler", "Catwoman", "Black Adam", "Circe", "Ocean Master", "Trigon", "Deathstroke", "Black Mask", "Mr. Freeze", "Killer Croc", "Mad Hatter", "Beast Boy", "Quantum Leap", "Chronomaster", "Nebula", "Echo", "Void", "Zephyr", "Ignis", "Hydro", "Electra", "Cryogen", "Titan", "Velocity", "Mindwarp", "Illusionist", "Invincible", "Healer", "Animalia", "Technopath", "Astronaut", "Phaser", "Invisible", "Soundwave", "Elastic", "Forcefield", "Regenerator", "Shapeshifter", "Telepath", "Telekinetic","Nemesis", "Chaos", "Dominator", "Phantom", "Corruptor", "Conqueror", "Mutator", "Mindbender", "Reaper", "Infector", "Inferno", "Tempest", "Shadowlord", "Enigma", "Overlord", "Destructor", "Manipulator", "Nightmare", "Parasite", "Toxic"]
const config = {
    dictionaries: [superCharacters],
    style: 'capital',
    randomDigits: 2 
  }
const botController = {};

botController.createBot = async (req, res) => {
  try {
    const wallet = ethers.Wallet.createRandom();

    const passphrase = process.env.PASSPHRASE;

    const encryptedPrivateKey = CryptoJS.AES.encrypt(
      wallet.privateKey,
      passphrase
    ).toString();

    const storedWallet = {
      publicKey: wallet.address,
      privateKey: encryptedPrivateKey,
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

botController.enterLotteries = async(req, res) => {
  try {
    const { publicKey, max } = req.params;
    console.log(publicKey, max);
    const contract = await ownerContract();
    let number = 1;
    while (number <= max) {
      contract.on(
        "LotteryCreated",
        (status, id, prize, ticketPrice, participants, winner, expiresAt) => {
          handleLotteryCreated(publicKey, id);
        }
      );
      
      number++;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error Executing Task" });
  }
};


const handleLotteryCreated = async (publicKey, id) => {
  console.log(publicKey);
  try {
    // wait 30sec
    await new Promise((resolve) => setTimeout(resolve, 30000));
    const bot = await Bot.findOne({ publicKey });
    // enter blockchain lottery
    const secretKey = CryptoJS.AES.decrypt(
      bot.privateKey,
      process.env.PASSPHRASE
    ).toString();
    
    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_PROVIDER);
    const wallet = new ethers.Wallet(secretKey, provider);
    const contract = new ethers.Contract(address.Bookie, abi, wallet);
    
    const tx = await contract.buyTicket(total, { value });
    await tx.wait();
    // enter web2 lottery
    const amount = 1;
    enterLottery(id, publicKey, amount);
  } catch (error) {
    console.log(error);
  }
};
const enterLottery = async (lotteryId, owner, totalAmount) => {
  let color = randomColor();
  try {
    await axios.put("http://127.0.0.1:4000/api/v1/lottery/enter", {
      lotteryId,
      owner,
      totalAmount,
      color,
    });
  } catch (error) {
    toast.error("error occured");
    console.log(error);
  }
};

module.exports = botController;
