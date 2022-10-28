const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");
require('dotenv').config();

const userRoute = require("./routes/userRouter");
const bookRoute = require("./routes/bookRouter");

const app = express();

//Test DB
sequelize
  .authenticate()
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("Error: " + err));

//Middlewares
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//ROUTES
app.use("/users", userRoute);
app.use("/books", bookRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App started on port ${port} at: `, new Date().toLocaleString());
});
