import mongoose from "mongoose";
import express from "express";
import dotenv  from "dotenv";
import {
  addEventToUser,
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "./controllers/user.js";
import cors from "cors";

const app = express();
dotenv.config();

app.use(express.json());

app.use(cors());

try {
  await mongoose.connect(
    process.env.MONGO_URI
  );
  console.log("MongoDB Connected");
} catch (error) {
  console.error("Error connecting to MongoDB:", error.message);
  process.exit(1);
}

app.get("/students", getAllUsers);
app.get("/student/:id", getUserById);
app.post("/student", createUser);
app.put("/student/:id", updateUser);
app.put("/student_addevent", addEventToUser);
app.delete("/student/:id", deleteUser);

app.listen(5001, () => {
  console.log("Server running on port 5001");
});
