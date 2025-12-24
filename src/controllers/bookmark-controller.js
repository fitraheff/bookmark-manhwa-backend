// bookmark.js
const prisma = require("../utils/database");
const ResponseError = require("../utils/response-error"); 
const { validate } = require("../validations/validation");
const {
    bookmarkSchema,
    updateBookmarkValidation,
    bookmarkQuerySchema
} = require("../validations/bookmark-validation");

const findBookmark = async (manhwaId, userId) => {
    return prisma.bookmark.findUnique({
        where: {
            manhwaId_userId: { manhwaId, userId },
        },
    });
};

const findBookmarkById = (bookmarkId, userId) => {
    return prisma.bookmark.findFirst({
        where: { id: bookmarkId, userId }
    });
};

// =====================================
// CONTROLLER + SERVICE (Public)
// =====================================

const addBookmark = async (req, res, next) => {

    try {
        const userId = req.user.id; // Ambil dari token
        const { manhwaId, chapter } = validate(bookmarkSchema, req.body);

        // Cek manhwa
        const exists = await prisma.manhwa.findUnique({
            where: { id: manhwaId },
        });
        if (!exists) throw new ResponseError(404, "Manhwa not found");

        // Prevent duplicate
        if (await findBookmark(manhwaId, userId)) {
            throw new ResponseError(400, "Already bookmarked");
        }

        const result = await prisma.bookmark.create({
            data: {
                manhwaId,
                userId,
                chapter,
            },
            select: { id: true, manhwaId: true, userId: true, chapter: true },
        });

        res.status(201).json({ data: result });
    } catch (err) {
        next(err);
    }
};


const getBookmarks = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const query = validate(bookmarkQuerySchema, {
            ...req.query,
            userId,
        });

        const result = await prisma.bookmark.findMany({
            where: {
                userId,
                ...(query.title && {
                    manhwa: {
                        title: {
                            contains: query.title,
                            mode: "insensitive",
                        },
                    },
                }),
            },
            select: {
                id: true,
                chapter: true,
                updatedAt: true,
                manhwa: {
                    select: {
                        id: true,
                        title: true,
                        coverImage: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        res.json({ data: result });
    } catch (err) {
        next(err);
    }
};


const updateBookmark = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const bookmarkId = req.params.id;

        const { chapter } = validate(updateBookmarkValidation, req.body);

        const existing = await findBookmarkById(bookmarkId, userId);
        if (!existing) throw new ResponseError(404, "Bookmark not found");

        const result = await prisma.bookmark.update({
            where:  { id: bookmarkId },
            data: { chapter },
            select: {
                id: true,
                chapter: true,
                manhwa: { select: { id: true, title: true, coverImage: true } },
            },
        });

        res.json({ data: result });
    } catch (err) {
        next(err);
    }
};


const deleteBookmark = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const bookmarkId = req.params.id;

        const existing = await findBookmarkById(bookmarkId, userId);
        if (!existing) throw new ResponseError(404, "Bookmark not found");

        await prisma.bookmark.delete({
            where: { id: bookmarkId },
        });

        res.json({ message: "Bookmark deleted" });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    addBookmark,
    getBookmarks,
    updateBookmark,
    deleteBookmark,
};
