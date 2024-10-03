import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {
  addActivityToStudent,
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
} from "./controllers/student.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

connectDB();

app.get("/students", getAllStudents);
app.get("/student/:id", getStudentById);
app.post("/student", createStudent);
app.put("/student/:id", updateStudent);
app.post("/student/:id/activity", addActivityToStudent);

app.delete("/student/:id", deleteStudent);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
