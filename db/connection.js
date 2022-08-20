const mongoose = require("mongoose");
require("dotenv").config();

// CONNECT MONGODB ATLAS
const url = process.env.MONGO_URL;

// connection params
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// connect mongodb
mongoose
  .connect(url, connectionParams)
  .then(() => console.log(`Connection to the DB is Successful.`))
  .catch((err) => console.log(`Connection to the DB is Broken.|| ${err}`));
