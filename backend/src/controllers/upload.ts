import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import fs from 'fs';
import { fileTypeFromBuffer } from 'file-type'
import BadRequestError from '../errors/bad-request-error'

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }
    const data = await fs.readFileSync(req.file.path);
    const type = await fileTypeFromBuffer(data)
    if (!type) {
        return next(new BadRequestError('неправильный тип файла'))
    }
    try {
        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
            : `/${req.file?.filename}`
        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file?.originalname,
        })
    } catch (error) {
        return next(error)
    }
}

export default {}
