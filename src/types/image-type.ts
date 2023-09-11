type Image = {
    id?: string,
    filename: string,
    uploadDate: Date,
    length: number,
    metadata: {
        createdBy: string,
        contentType: string,
        originalName: string
    }
}