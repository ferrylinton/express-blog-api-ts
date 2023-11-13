export const replaceUrl = (content: string, prefix: string) => {
    const regex = /\]\((.+)(?=(\.(svg|gif|png|jpe?g)))/g;

    return content.replace(regex, (_fullResult, imagePath) => {
        const newImagePath = `${prefix}/api/images/${imagePath}`
        return `](${newImagePath}`;
    })
}