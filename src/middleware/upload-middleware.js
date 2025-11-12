// import multer from 'multer';

// // Konfigurasi multer untuk menyimpan file di buffer
// const storage = multer.memoryStorage();
// export const upload = multer({
//     storage,
//     limits: { fileSize: 10 * 1024 * 1024 }, // Maksimal 5MB
//     fileFilter: (req, file, cb) => {
//         const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
//         if (!allowedTypes.includes(file.mimetype)) {
//             return cb(new Error('Only .jpg, .jpeg, and .png files are allowed'));
//         }
//         cb(null, true);
//     },
// });
