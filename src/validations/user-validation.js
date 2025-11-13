const Joi = require('joi')

const registerUserValidation = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    // role: Joi.string().valid('ADMIN', 'USER', 'SUPERADMIN').default('USER'), 
})

const loginUserValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
})

const updateUserValidation = Joi.object({
    username: Joi.string().min(3).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    currentPassword: Joi.string().min(6)
    .when('password', { 
        is: Joi.exist(), then: Joi.required(), otherwise: Joi.forbidden() 
    }),
})

const updateUserRoleValidation = Joi.object({
    // id: Joi.string().uuid().required(), // UUID untuk id
    role: Joi.string().valid('ADMIN', 'USER', 'SUPERADMIN').required(), // Role wajib
})

module.exports = {
    registerUserValidation,
    loginUserValidation,
    updateUserValidation,
    updateUserRoleValidation
}
