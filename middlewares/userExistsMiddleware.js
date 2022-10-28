//a middleware that controls if user with given id is exist or not

const User = require('../models/User');

module.exports = async (req, res, next) => {
    await User.findOne({ where: { id: req.params.id } })
        .then((user) => {
            if (!user) {
                res.status(401);
            }
            next();
        })
        .catch((err) => {
            res.status(500);
        });
};
