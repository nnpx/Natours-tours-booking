const mongoose = require('mongoose');
const dotenv = require('dotenv');

//handle catching error ex console.log(x) where x is not defined
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
});

dotenv.config({ path: './config.env' });
const app = require('./app');
// console.log(app.get('env')); //development
// console.log(process.env.NODE_ENV); //development

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => {
  console.log('DATABASE connection successfull..');
});
// .catch((err) => console.log('ERROR'));

const port = process.env.port || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1); //0=success 1=uncaught rejection
  });
});
