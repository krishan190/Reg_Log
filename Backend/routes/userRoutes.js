import express from "express";
import User from "../models/userModel.js";
import countryModel from "../models/countryModel.js";
import State from "../models/stateModel.js";
import City from "../models/cityModel.js";
import RegisterModel from "../models/RegisterModel.js";
import { comparePassword, hashPassword } from "../helper/authHelper.js";
import JWT from "jsonwebtoken"
import { requireSignIn } from "../middleware/authMiddleware.js";
import { validateRegister } from "../middleware/validateRegister.js";
import { validationResult } from "express-validator";


const router = express.Router();


// protected routes
router.get("/test", requireSignIn, (req, res) => {
    try {
        res.status(200).send("Protected route accessed successfully!");
    } catch (error) {
        // console.error("Error:", error);
        res.status(401).json({
            success: false,
            error,
            message: "Invalid Token"
        });
    }
});

// get all countries
router.get("/countries", async (req, res) => {
    try {
        const countries = await countryModel.find();
        res.status(200).json(countries);
    } catch (error) {
        res.status(500).json({ message: "Error fetching countries", error });
    }
});

// GET all users
router.get("/", async (req, res) => {
    try {
        const userData = await User.find();
        if (!userData || userData.length === 0) {
            return res.status(404).json({ message: "user data not found" });
        }
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ success: false, message: "server error" });
    }
});

// get user by specific id
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const userExist = await User.findById(id);
        if (!userExist) {
            return res.status(404).json({ message: "user not found" });
        }
        res.status(200).json({ userExist, message: "user exist" });
    } catch (error) {
        res.status(500).json({ success: false, message: "server error" });
    }
});

// CREATE a new user
router.post("/", async (req, res) => {
    const field = req.body;

    if (!field.name || !field.email || !field.address) {
        return res
            .status(400)
            .json({ success: false, message: "Please provide all fields" });
    }

    try {
        const newUser = new User(req.body);
        const { email } = newUser;

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exist" });
        }

        const savedData = await newUser.save();
        res.status(200).json(savedData);
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
});

// // PUT - Update a user
// router.put("/:id", async (req, res) => {
//     try {
//         const id = req.params.id;
//         const userExist = await User.findById(id);
//         if (!userExist) {
//             return res.status(404).json({ message: "User Not Found." });
//         }

//         const updatedData = await User.findByIdAndUpdate(id, req.body, {
//             new: true,
//         });
//         // res.status(200).json(updatedData);
//         res.status(200).json({ message: "User Updated Successfully." });
//     } catch (error) {
//         res.status(500).json({ errorMessage: error.message });
//     }
// });


// PUT - Update a user
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedUser);
});

// DELETE a user
router.delete("/:id", async (req, res) => {
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
});

// Get states by country short name
router.get("/states/:countryShortName", async (req, res) => {
    const { countryShortName } = req.params;
    try {
        const states = await State.find({ country_short_name: countryShortName });
        res.status(200).json(states);
    } catch (error) {
        res.status(500).json({ message: "Error fetching states", error });
    }
});

// get all cities
router.get("/cities", async (req, res) => {
    try {
        const cities = await City.find();
        res.status(200).json(cities);
    } catch (error) {
        res.status(500).json({ message: "Error fetching City", error });
    }
});

// get city by state Name
router.get("/cities/:stateName", async (req, res) => {
    const { stateName } = req.params;
    try {
        const cities = await City.find({ short_name: stateName });
        res.status(200).json(cities);
    } catch (error) {
        res.status(500).json({ message: "test  €Error fetching City", error });
    }
});


// Register API Endpoint

router.post("/register", async (req, res) => {
    const { name, email, address, country, state, city, password } = req.body;
    
    if (!name) return res.status(400).json({ success: false, message: "Name is required" });
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });
    if (!email.includes("@")) return res.status(400).json({ success: false, message: "Invalid email format" });
    if (!address) return res.status(400).json({ success: false, message: "Address is required" });
    if (!country) return res.status(400).json({ success: false, message: "Country is required" });
    if (!state) return res.status(400).json({ success: false, message: "State is required" });
    if (!city) return res.status(400).json({ success: false, message: "City is required" });
    if (!password || password.length < 6) {
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
    }

    try {
        // Check if user already exists
        const existingUser = await RegisterModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email is already registered. Please log in.",
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create and save new user
        const newUser = new RegisterModel({
            name,
            email,
            address,
            country,
            state,
            city,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                name: newUser.name,
                email: newUser.email,
                country: newUser.country,
                state: newUser.state,
                city: newUser.city,
            },
        });
    } catch (error) {
        console.error("Error during registration:", error);

        res.status(500).json({
            success: false,
            message: "An error occurred during registration",
            error: error.message,
        });
    }
}
);


// login routes
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password",
            });
        }

        // check user
        const user = await RegisterModel.findOne({ email });
        if (!user) {
            return res.status(401).send({
                success: false,
                message: "Email is not registered"
            })
        }

        // comparePassword
        const matchPassword = await comparePassword(password, user.password);
        if (!matchPassword) {
            return res.status(401).send({
                success: false,
                message: "Invalid Password"
            })
        }

        // token
        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "10m",
        });
        res.status(200).send({
            success: true,
            message: "Login Successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Login",
            error,
        })
    }
})



export default router;