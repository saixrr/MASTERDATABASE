import mongoose from "mongoose";
import express from "express";
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

app.use(express.json());

app.use(cors());

try {
  await mongoose.connect(
    "mongodb+srv://dev:bwkFrK7OFZrdqD72@cluster0.jqzzfst.mongodb.net/master-db?retryWrites=true&w=majority&appName=Coursevita"
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

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
