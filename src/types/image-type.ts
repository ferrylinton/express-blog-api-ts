export type ImageMetadata = {
    createdBy: string,
    contentType: string,
    originalName: string,
    width: number,
    height: number
}

export type Image = {
    filename: string,
    uploadDate: Date,
    length: number,
    metadata: ImageMetadata,
    urls?: string[]
}

export type MulterCallback = (error?: any, info?: Partial<Express.Multer.File> | undefined) => void