import fs from "node:fs";
import path from "node:path";
import multer from "multer";

const uploadDir = path.resolve(process.cwd(), "uploads", "requests");
fs.mkdirSync(uploadDir, { recursive: true });

export const uploadRequestAttachment = multer({
    storage: multer.diskStorage({
        destination: (_req, _file, callback) => {
            callback(null, uploadDir);
        },
        filename: (_req, file, callback) => {
            const ext = path.extname(file.originalname);
            const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
            callback(null, fileName);
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});