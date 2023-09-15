export type ImageMetadata = {
    createdBy: string,
    contentType: string,
    originalName: string
}

export type Image = {
    filename: string,
    uploadDate: Date,
    length: number,
    metadata: ImageMetadata
}

export type MulterCallback = (error?: any, info?: Partial<Express.Multer.File> | undefined) => void