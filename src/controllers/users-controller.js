const prisma = require('../utils/database')
const bcrypt = require('bcrypt')
const { generateAccessToken, generateRefreshToken } = require("../utils/token-manage")
const ResponseError = require('../utils/response-error')
const { validate } = require('../validations/validation')
const {
    registerUserValidation,
    loginUserValidation,
    updateUserValidation
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
        const data = validate(updateUserValidation, req.body)

        if (req.user.id !== req.params.id) {
            throw new ResponseError(403, 'Forbidden')
        }

        const user = await prisma.user.update({
            where: {
                id: req.params.id
            },
            data
        })

        if (!user) {
            throw new ResponseError(404, 'User not found')
        }

        return res.json(user)
    } catch (error) {
        throw new ResponseError(500, error.message)
    }
}

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
    deleteUser
}