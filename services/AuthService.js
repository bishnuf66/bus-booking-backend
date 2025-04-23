const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const saltRounds = 10;

class AuthService {
    constructor(db) {
        this.userModel = new User(db);
    }

    async register(registerData) {
        try {
            // Check if user already exists
            const existingUser = await this.userModel.findByEmail(registerData.email);
            if (existingUser) {
                return {
                    message: "Email already exists",
                    success: false
                };
            }

            const hashedPass = await bcrypt.hash(registerData.password, saltRounds);

            const user = await this.userModel.create({
                email: registerData.email,
                userName: registerData.userName,
                phone: registerData.phone,
                password: hashedPass,
            });

            return {
                message: "User created successfully",
                success: true,
                data: {
                    id: user._id,
                    email: user.email,
                    userName: user.userName,
                    phone: user.phone,
                    createdAt: user.createdAt
                }
            };
        } catch (error) {
            console.error("Registration error:", error);
            throw {
                message: "Internal Server Error",
                success: false
            };
        }
    }

    async login(loginData) {
        try {
            const user = await this.userModel.findByEmail(loginData.email);
            
            if (!user) {
                return {
                    message: "Invalid email",
                    success: false
                };
            }

            const passwordMatch = await this.userModel.comparePassword(loginData.password, user.password);
            if (!passwordMatch) {
                return {
                    message: "Invalid password",
                    success: false
                };
            }

            const token = jwt.sign(
                { 
                    email: user.email, 
                    id: user._id, 
                    userName: user.userName 
                },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
            );

            return {
                message: "Login successful",
                token: token,
                success: true,
                user: {
                    id: user._id,
                    email: user.email,
                    userName: user.userName,
                    phone: user.phone
                }
            };

        } catch (error) {
            console.error("Login error:", error);
            throw {  
                message: "Internal Server Error",
                success: false
            };
        }
    }

    async getProfile(userId) {
        try {
            const user = await this.userModel.findById(userId);
            
            if (!user) {
                return {
                    message: "User not found",
                    success: false
                };
            }

            // Remove password from user object
            const { password, ...userWithoutPassword } = user;

            return {
                message: "Profile retrieved successfully",
                success: true,
                data: userWithoutPassword
            };

        } catch (error) {
            console.error("Get profile error:", error);
            throw {  
                message: "Internal Server Error",
                success: false
            };
        }
    }

    async updateProfile(userId, updateData) {
        try {
            const user = await this.userModel.findById(userId);
            
            if (!user) {
                return {
                    message: "User not found",
                    success: false
                };
            }

            // Update allowed fields
            if (updateData.userName) user.userName = updateData.userName;
            if (updateData.phone) user.phone = updateData.phone;
            
            // If password is being updated
            if (updateData.password) {
                const hashedPass = await bcrypt.hash(updateData.password, saltRounds);
                user.password = hashedPass;
            }

            const updatedUser = await this.userModel.update(userId, user);

            return {
                message: "Profile updated successfully",
                success: true,
                data: {
                    id: updatedUser._id,
                    email: updatedUser.email,
                    userName: updatedUser.userName,
                    phone: updatedUser.phone,
                    updatedAt: updatedUser.updatedAt
                }
            };

        } catch (error) {
            console.error("Update profile error:", error);
            throw {  
                message: "Internal Server Error",
                success: false
            };
        }
    }
}

module.exports = AuthService;
