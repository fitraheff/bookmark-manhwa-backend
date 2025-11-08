const joi = require('joi')

const createManhwaValidation = joi.object({
    title: joi.string().min(3).required(),
    cover_image: joi.string().uri().required(),
})

const updateManhwaValidation = joi.object({
    title: joi.string().min(3).optional(),
    cover_image: joi.string().uri().optional(),
})

module.exports = {
    createManhwaValidation,
    updateManhwaValidation
}