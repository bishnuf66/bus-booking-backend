const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../database/models/User');
const saltRounds = 10;

// User Register
module.exports.Register = (registerData) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Check if email already exists
            const existingUser = await User.findOne({ email: registerData.email });
            if (existingUser) {
                return resolve({
                    message: "Email already exists",
                    success: false,
                });
            }

            const hashedPass = await bcrypt.hash(registerData.password, saltRounds);
            const newUser = new User({
                email: registerData.email,
                userName: registerData.userName,
                password: hashedPass,
                phone: registerData.phone, // Must be unique
            });

            await newUser.save();

            resolve({
                message: "User created successfully",
                success: true,
                data: newUser,
            });
        } catch (error) {
            console.error("Register error:", error);
            reject({
                message: "Internal Server Error",
                success: false,
            });
        }
    });
};

// User Login
module.exports.Login = (loginData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ email: loginData.email });
            if (!user) {
                return reject({
                    message: "Invalid email",
                    success: false,
                });
            }
            const passwordMatch = await bcrypt.compare(loginData.password, user.password);

            if (!passwordMatch) {
                return reject({
                    message: "Invalid password",
                    success: false,
                });
            }

            const token = jwt.sign(
                {
                    email: user.email,
                    id: user._id,
                    userName: user.userName,
                },
                process.env.SECRET_KEY,
                { expiresIn: "24h" }
            );

            resolve({
                message: "Login successful",
                token,
                success: true,
            });
        } catch (error) {
            console.error("Login error:", error);
            reject({
                message: "Internal Server Error",
                success: false,
            });
        }
    });
};
