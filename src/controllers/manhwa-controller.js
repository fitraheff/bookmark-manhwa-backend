const prisma = require('../utils/database')
const ResponseError = require('../utils/response-error');
const { validate } = require('../validations/validation')
const {
    createManhwaValidation,
    updateManhwaValidation
} = require('../validations/manhwa-validation')

const manhwaExists = async (title) => {
    const manhwa = await prisma.manhwa.findFirst({
        where: {
            title
        }
    })
    if (manhwa) {
        throw new ResponseError(409, 'Manhwa already exists')
    }
}

const getAllManhwa = async (req, res) => {
    try {
        const manhwa = await prisma.manhwa.findMany()
        return res.json(manhwa)
    } catch (error) {
        throw new ResponseError(404, error.message)
    }
}

const addManhwa = async (req, res) => {
    try {
        validate(createManhwaValidation, req.body);

        await manhwaExists(req.body.title);

        const manhwa = await prisma.manhwa.create({
            data: {
                title: req.body.title,
                desc: req.body.desc,
                coverImage: req.body.cover_image || req.body.coverImage // ← mapping
            }
        });

        return res.json(manhwa);
    } catch (error) {
        // 400 = Bad Request, 401 = Unauthorized
        throw new ResponseError(400, error.message);
    }
};

const getManhwa = async (req, res) => {
    try {
        const { id, title } = req.query
        const manhwa = await prisma.manhwa.findUnique({
            where: id ? { id } : { title }
        })

        if (!manhwa) {
            throw new ResponseError(404, 'Manhwa not found')
        }
        return res.json(manhwa)
    } catch (error) {
        throw new ResponseError(500, error.message)
    }
}

const updateManhwa = async (req, res) => {
    try {
        validate(updateManhwaValidation, req.body)
        manhwaExists(req.body.title)
        const manhwa = await prisma.manhwa.update({
            where: {
                id: req.params.id
            },
            data: {
                title: req.body.title,
                desc: req.body.desc,
                coverImage: req.body.coverImage
            }
        })
        return res.json(manhwa)
    } catch (error) {
        if (error.code === 'P2025') {
            throw new ResponseError(404, 'Manhwa not found')
        }
        throw new ResponseError(400, error.message)
    }
}

const deleteManhwa = async (req, res) => {
    try {
        const manhwa = await prisma.manhwa.delete({
            where: {
                id: req.params.id
            }
        })
        return res.json({
            message: 'Manhwa deleted'
        })
    } catch (error) {
        if (error.code === 'P2025') {
            throw new ResponseError(404, 'Manhwa not found')
        }
        throw new ResponseError(500, error.message)
    }
}

module.exports = {
    getAllManhwa,
    addManhwa,
    getManhwa,
    updateManhwa,
    deleteManhwa
}