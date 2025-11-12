const jwt = require('jsonwebtoken');
const prisma = require('../utils/database')
const ResponseError = require('../utils/response-error')

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ errors: "Unauthorized: Missing token" });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Cari user dan token di database
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                role: true,
            },
        });

        if (!user) {
            return res.status(401).json({ errors: "Invalid token" });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Access token expired" });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Invalid token" });
        }
        next(error);
    }
};

export const authAdminMiddleware = async (req, res, next) => {
    // Pastikan user sudah terotentikasi
    if (!['ADMIN', 'SUPERADMIN'].includes(req.user.role)) {
        return next(new ResponseError(403, "Forbidden: Admin or Superadmin only"));
    }
    next();
};

// Middleware untuk SUPERADMIN-only
export const authSuperadminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== 'SUPERADMIN') {
        return next(new ResponseError(403, "Forbidden"));
    }
    next();
};