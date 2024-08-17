const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');

process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
  });
  
  // Config
  dotenv.config({ path: 'backend/config/config.env' });

  connectDatabase();



const server = app.listen(process.env.PORT, () => {
    console.log(
      `Server is Working on Port http://localhost:${process.env.PORT} `
    );
  });
  
  // unhandled Promise Rejection
  process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection`);
  
    server.close(() => {
      process.exit(1);
    });
  });
  