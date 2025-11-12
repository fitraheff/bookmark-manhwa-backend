const prisma = require('../config/utils')
import bcrypt from "bcrypt";
const { generateAccessToken, generateRefreshToken } = require("../utils/token-manager")
const ResponseError = require('../config/response-error')
const { validate } = require('../validations/validation')
const {
    registerUserValidation,
    loginUserValidation,
    updateUserValidation
} = require('../validations/user-validation')

const registerUser = async (req, res) => {
    try {
        const data = validate(registerUserValidation, req.body)
        const hashedPassword = await bcrypt.hash(data.password, 10)
        const user = await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: hashedPassword,
                role: data.role
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
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)
        return res.json({ accessToken, refreshToken })
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

const getUser = async (req, res) => {
    try {
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
        const user = await prisma.user.update({
            where: {
                id: req.params.id
            },
            data
        })
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