const mongoose = require("mongoose");

const connectDatabase = () => {
  const DB = process.env.DATABASE;

  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
    })
    .then((data) => {
      console.log(`Mongodb connected with server`);
    });
};

module.exports = connectDatabase;