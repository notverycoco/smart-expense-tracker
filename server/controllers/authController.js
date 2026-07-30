const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {

    try {

        const { full_name, email, password } = req.body;

        if (!full_name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check if email already exists
        User.findUserByEmail(email, async (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error"
                });
            }

            if (result.length > 0) {
                return res.status(409).json({
                    message: "Email already exists"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            User.createUser(
                {
                    full_name,
                    email,
                    password: hashedPassword
                },
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            message: "Registration Failed"
                        });
                    }

                    res.status(201).json({
                        message: "User Registered Successfully"
                    });

                }
            );

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

const login = (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and Password are required"
        });
    }

    User.findUserByEmail(email, async (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            message: "Login Successful",
            token
        });

    });

};

module.exports = {
    register,
    login
};