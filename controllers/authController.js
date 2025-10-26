import bcrypt from 'bcrypt'
import User from '../models/Users.js';
import generateToken from '../utils/generateToken.js';

// Register users
export const registerUser = async (req, res, next) => {
       try {
              const { name, email, password } = req.body;

              if (!email || !name || !password) {
                     return res.status(400).json({ success: false, message: "All fields are required" });
              }

              const existingUser = await User.findOne({ email });
              if (existingUser) {
                     return res.status(400).json({ success: false, message: "User already exists" });
              }

              const user = await User.create({ name, email, password })

              // Generate Token
              const token = generateToken(user._id);

              res.status(201).json({
                     success: true,
                     message: "User registered successfully",
                     token,
                     user: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                     },
              });
       } catch (error) {
              next(error);
              // console.error("Register Error:", error);
              // res.status(500).json({ success: false, message: "Server error" });
       }
}

// Login User
export const loginUser = async (req, res, next) => {
       try {
              const { email, password } = req.body;

              // Validate
              if (!email || !password) {
                     return res.status(400).json({ success: false, message: "Email and password are required" });
              }

              // Find user
              const user = await User.findOne({ email });
              if (!user) {
                     return res.status(401).json({ success: false, message: "Invalid credentials" });
              }

              // Compare Password
              const isMatch = await user.comparePassword(password);
              if (!isMatch) {
                     return res.status(401).json({ success: false, message: "Invalid credentials" });
              }

              // Generate token
              const token = generateToken(user._id);

              res.json({
                     success: true,
                     message: "Login successful",
                     token,
                     user: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                     },
              });
       } catch (error) {
              next(error)
       }
}

// Get Profile details
export const getProfile = async (req, res, next) => {
       try {
              const user = await User.findById(req.user.id).select("-password");
              if (!user) {
                     return res.status(404).json({ success: false, message: "User not found" });
              }

              res.json({ success: true, user });
       } catch (error) {
              next(error)
              // console.error("Profile Error:", error);
              // res.status(500).json({ success: false, message: "Server error" });
       }
}

// UPDATE USER DETAILS
export const updateUser = async (req, res, next) => {
       try {
              const { name, password } = req.body;
              const user = await User.findById(req.user.id);

              if (!user) {
                     return res.status(404).json({ success: false, message: "User not found" });
              }

              if (name) user.name = name;
              if (password) {
                     const salt = await bcrypt.genSalt(10);
                     user.password = await bcrypt.hash(password, salt);
              }

              await user.save();

              res.json({
                     success: true,
                     message: "User updated successfully",
                     user: { _id: user._id, name: user.name, email: user.email },
              });
       } catch (error) {
              next(error)
              //     console.error("Update Error:", error);
              //     res.status(500).json({ success: false, message: "Server error" });
       }
};

//  DELETE USER ACCOUNT
export const deleteUser = async (req, res, next) => {
       try {
              const userId = req.user.id;

              // In future: delete related expenses, categories, budgets
              await User.findByIdAndDelete(userId);

              res.json({ success: true, message: "Account deleted successfully" });
       } catch (error) {
              next(error)
              //     console.error("Delete Error:", error);
              //     res.status(500).json({ success: false, message: "Server error" });
       }
};
