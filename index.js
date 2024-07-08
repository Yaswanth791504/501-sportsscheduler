require("dotenv").config({ path: "./config.env" });

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const view_router = require("./views/directions.js");
const auth_routes = require("./routes/authRoutes.js");
const session_routes = require("./routes/sessionRoutes.js");
const session_member_routes = require("./routes/sessionMemberRoutes.js");
const setupAssociations = require("./models/associations");
const sequelize = require("./db");
const app = express();

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev"));

// routes
app.use("/api/auth", auth_routes);
app.use("/api/sessions", session_routes);
app.use("/api/session_members", session_member_routes);
app.use("/", view_router);

app.listen(process.env.PORT, async () => {
  try {
    await sequelize.authenticate();
    setupAssociations();
    await sequelize.sync({ alter: true });
    console.log("All models were synchronized successfully.");
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  console.log(`Server is running on port ${process.env.PORT}`);
});
