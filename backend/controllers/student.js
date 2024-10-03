import Student from "../models/student.js";
import mongoose from "mongoose";
const Activity = mongoose.model("Activity");

// Create a new Student
export const createStudent = async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res
      .status(201)
      .json({ message: "Student created successfully", Student: newStudent });
  } catch (error) {
    res.status(400).json({ message: "Error creating Student", error });
  }
};

// Get all Students
export const getAllStudents = async (req, res) => {
  try {
    const Students = await Student.find();
    res.status(200).json(Students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Students", error });
  }
};

// Get a single Student by ID
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({
      student_id: req.params.id,
    }).populate("activitys");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Student", error });
  }
};

// Update a Student by ID
export const updateStudent = async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { student_id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({
      message: "Student updated successfully",
      Student: updatedStudent,
    });
  } catch (error) {
    res.status(400).json({ message: "Error updating Student", error });
  }
};

// Add an Activity by Student ID
export const addActivityToStudent = async (req, res) => {
  const { title, description, date, tag } = req.body;

  try {
    const newActivity = new Activity({ title, description, date, tag });
    await newActivity.save();

    const updatedStudent = await Student.findOneAndUpdate(
      { student_id: req.params.id },
      { $push: { activitys: newActivity._id } },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Activity added successfully",
      Student: updatedStudent,
    });
  } catch (error) {
    res.status(400).json({ message: "Error adding Activity", error });
  }
};

// Delete a Student by ID
export const deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await Student.findOneAndDelete({
      student_id: req.params.id,
    });
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({
      message: "Student deleted successfully",
      Student: deletedStudent,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Student", error });
  }
};
