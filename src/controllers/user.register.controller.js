const { registerUser } = require('../services/user.register.service');

const register = async (req, res, next) => {
    try {
        const user = await registerUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register
};