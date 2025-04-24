const { validateLogin, validateRegister } = require("../middleware/validators/authValidators");
const { Login, Register } = require("../services/AuthService");


module.exports.Login = async (req, res) => {
    try {
        // Validate the login data
        await validateLogin(req.body);
        const result = await Login(req.body, res);
        if (result) {
            return res.status(200).json(result);
        }
    } catch (err) {
        console.error("Error during login:", err); 
        return res.status(400).json({
            message: err.message || "Validation or login failed",
            success: false
        });
    }
};

module.exports.Register = async (req, res) => {
    try {
        // Validate the registration data
        const validatedData = await validateRegister(req.body);
        console.log("Validated Data:", validatedData);

        const result = await Register(req.body, res);
        if (result) {
            return res.status(200).json(result);
        }
    } catch (err) {
        console.error("Error during registration:", err); 
        return res.status(400).json({
            message: err.message || "Validation or registration failed",
            success: false
        });
    }
};