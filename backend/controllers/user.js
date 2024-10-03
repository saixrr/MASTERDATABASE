import User from "../models/user.js";

// Create a new user
export const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Get a single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({student_id:req.params.id});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

// Update a user by ID
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate({student_id:req.params.id}, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(400).json({ message: "Error updating user", error });
  }
};

// Add an event by user ID
export const addEventToUser = async (req, res) => {
  const { title, description, date, tag } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      {student_id:req.params.id},
      {
        $push: {
          events: { title, description, date, tag },
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Event added successfully", user: updatedUser });
  } catch (error) {
    res.status(400).json({ message: "Error adding event", error });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({student_id:req.params.id});
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
