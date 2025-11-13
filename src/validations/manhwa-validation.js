const joi = require('joi')

const createManhwaValidation = joi.object({
    title: joi.string().min(3).required(),
    coverImage: joi.string().uri().optional(),
    desc: joi.string().optional()
})

const updateManhwaValidation = joi.object({
    title: joi.string().min(3).optional(),
    coverImage: joi.string().uri().optional(),
})

module.exports = {
    createManhwaValidation,
    updateManhwaValidation
}