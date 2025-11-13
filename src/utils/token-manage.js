const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user.id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { userId: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
    );
};

// const verifyRefreshToken = (refreshToken) => {
//     try {
//         return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
//     } catch (error) {
//         throw new ResponseError(401, "Invalid refresh token");
//     }
// };

module.exports = { generateAccessToken, generateRefreshToken };
