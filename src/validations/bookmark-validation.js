const Joi = require('joi');

const bookmarkSchema = Joi.object({
    manhwaId: Joi.string().uuid().required(),
    // userId: Joi.string().uuid().required(),
    chapter: Joi.number().integer().min(1).optional(),
});

const updateBookmarkValidation = Joi.object({
    // manhwaId: Joi.string().uuid().optional(),
    // userId: Joi.string().uuid().optional(),
    chapter: Joi.number().integer().min(1).optional(),
});

const bookmarkQuerySchema = Joi.object({
    // title: Joi.string().min(1).max(250).optional(),
    userId: Joi.string().uuid().required(),
});

module.exports = {
    bookmarkSchema,
    updateBookmarkValidation,
    bookmarkQuerySchema
};