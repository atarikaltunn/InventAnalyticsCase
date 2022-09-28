const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");

const userRoute = require("./routes/userRouter");
const bookRoute = require("./routes/bookRouter");

const app = express();

//Test DB
sequelize
  .authenticate()
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("Error: " + err));

//ROUTES
app.use("/users", userRoute);
app.use("/books", bookRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App started on port ${port} at: `, new Date().toLocaleString());
});