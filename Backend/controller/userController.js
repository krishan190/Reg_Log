import User from "../models/userModel.js";

// For Posting new user into Database
export const create = async (req, res) => {
  try {
    const requiredFields = ["name", "email", "phone", "city", "country", "password"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required.` });
      }
    }

    const newUser = new User(req.body);
    const { email } = newUser;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already Exist." });
    }
    const savedData = await newUser.save();
    res.status(200).json({ savedData, message: "User Created Successfully." });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// getAllUser
export const getAllUsers = async (req, res) => {
  try {
    const userData = await User.find();
    // console.log(userData);

    if (!userData || userData.length === 0) {
      return res.status(404).json({ message: "User data not found." });
    }
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// get specific user 
export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(userExist);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// updated specific user
export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User Not Found." });
    }

    const updatedData = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({ updatedData, message: "User Updated Successfully." });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// delete specific user 
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User Not Found." });
    }
    await User.findByIdAndDelete(id);
    res.status(201).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

