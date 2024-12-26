import express from "express";
import morgan from "morgan";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/userRoutes.js";

// configure dotenv
dotenv.config();

// DB connection
connectDB();

// rest object
const app = express();

// rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to CRUD APP</h1>");
});

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/users", router);

// run listen
app.listen(8081, () => {
  console.log(`server running on 8081`);
});