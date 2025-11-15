const prisma = require('../utils/database')
const bcrypt = require('bcrypt')
const { generateAccessToken, generateRefreshToken } = require("../utils/token-manage")
const ResponseError = require('../utils/response-error')
const { validate } = require('../validations/validation')
const {
    registerUserValidation,
    loginUserValidation,
    updateUserValidation,
    updateUserRoleValidation
} = require('../validations/user-validation')

const registerUser = async (req, res) => {
    try {
        // pertama dia validate data yang dikirim dari client atau req body
        const data = validate(registerUserValidation, req.body)

        // selanjutnya password di hash
        const hashedPassword = await bcrypt.hash(data.password, 10)

        // kemudian di simpan ke database
        const user = await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: hashedPassword,
                role: 'USER'
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true
            }
        })
        return res.json(user)
    } catch (error) {
        throw new ResponseError(400, error.message)
    }
}

const loginUser = async (req, res) => {
    try {
        const data = validate(loginUserValidation, req.body)
        const user = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        })
        if (!user) {
            throw new ResponseError(404, 'User not found')
        }
        const isPasswordValid = await bcrypt.compare(data.password, user.password)
        if (!isPasswordValid) {
            throw new ResponseError(401, 'Invalid password')
        }

        // HAPUS PASSWORD DARI MEMORY
        delete user.password;

        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)
        return res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            accessToken,
            refreshToken
        })
    } catch (error) {
        throw new ResponseError(400, error.message)
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany()
        return res.json(users)
    } catch (error) {
        throw new ResponseError(500, error.message)
    }
}

// get user by id
// dan ini juga hanya bisa diakses oleh admin
const getUser = async (req, res) => {
    try {
        if (req.user.id !== req.params.id) {
            throw new ResponseError(403, 'Forbidden')
        }

        const user = await prisma.user.findUnique({
            where: {
                id: req.params.id
            }
        })
        if (!user) {
            throw new ResponseError(404, 'User not found')
        }

        return res.json(user)
    } catch (error) {
        throw new ResponseError(500, error.message)
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Hanya user itu sendiri
        if (req.user.id !== userId) {
            throw new ResponseError(403, "Forbidden");
        }

        const body = validate(updateUserValidation, req.body);

        // Ambil user dari DB (bukan dari JWT)
        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            throw new ResponseError(404, "User not found");
        }

        // Field yang boleh diupdate (whitelisting)
        const updateData = {};

        if (body.username) updateData.username = body.username;
        if (body.email) updateData.email = body.email;

        if (body.password) {
            const isPasswordValid = await bcrypt.compare(
                body.currentPassword,
                existingUser.password
            );

            if (!isPasswordValid) {
                throw new ResponseError(401, "Invalid current password");
            }

            updateData.password = await bcrypt.hash(body.password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                username: true,
                email: true,
                // role: true,
                updatedAt: true
            }
        });

        return res.json(updatedUser);
    } catch (error) {
        throw new ResponseError(500, error.message)
    }
}

// controllers/userController.js
const updateUserRole = async (req, res) => {
    try {
        const { role } = validate(updateUserRoleValidation, req.body);
        const { id: userId } = req.params;

        // superadmin tidak boleh ubah role dirinya sendiri
        if (req.user.id === userId) {
            throw new ResponseError(400, "You cannot modify your own role");
        }

        const User = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!User) {
            throw new ResponseError(404, "User not found");
        }

        const updated = await prisma.user.update({
            where: { id: userId },
            data: { role },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                updatedAt: true
            }
        });

        const { password, ...safeUser } = updated;
        return res.json(safeUser);

    } catch (error) {
        // console.error(error);
        throw new ResponseError(500, error.message);
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await prisma.user.delete({
            where: {
                id: req.params.id
            }
        })
        return res.json(user)
    } catch (error) {
        throw new ResponseError(500, error.message)
    }
}

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUser,
    updateUser,
    updateUserRole,
    deleteUser
}