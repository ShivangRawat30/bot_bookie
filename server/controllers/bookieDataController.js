const BookieData = require("../models/bookieData");


const bookieDataController = {};

bookieDataController.createData = async(req,res) => {
    try{
        const newData = BookieData({
            AmountSpent: 0,
            AmountEarned: 0,
            CurrentAmount: 0
        })
        const final = new BookieData(newData);
        await final.save();
        res.status(201).json({ message: "Bookie created successfully" });

    } catch(error){
        console.error(error);
        res.status(500).json({ message: "Error creating user" });
    }
}

bookieDataController.addAmountSpend = async(req,res) => {
    try{
        const {amount} = req.body;
        console.log(amount);
        const bookie = await BookieData.find({});
        const newAmount = bookie[0].AmountSpent + amount;
        const id = bookie[0].id;
        await BookieData.findOneAndUpdate(
            { _id: id }, // Update the specific document
            { AmountSpent: newAmount },
            { new: true }
          );
        res.status(201).json({ message: "Amount Spent added" });

    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Error creating user" });
    }
}

bookieDataController.addAmountEarned = async(req,res) => {
    try{
        const {amount} = req.body;
        const bookie = await BookieData.find({});
        const newAmount = bookie[0].AmountEarned + amount;
        const id = bookie[0].id;
        await BookieData.findOneAndUpdate(
            { _id: id }, // Update the specific document
            { AmountEarned: newAmount },
            { new: true }
          );
        res.status(201).json({ message: "Amount Earned added" });

    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Error creating user" });
    }
}

bookieDataController.getAllData = async(req,res) => {
    try{
        const data = await BookieData.find({});
        const returnData = data[0];
        res.status(200).json(returnData);

    } catch(error) {
        console.log(error);
        res.status(500).json({message: "Error getting data"})
    }
}


module.exports = bookieDataController;
