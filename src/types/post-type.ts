export type Post = {
    slug: string,
    tags: String[],
    title: {
        id: string,
        en: string
    },
    description: {
        id: string,
        en: string
    },
    content: {
        id: string,
        en: string
    },
    viewed?: any
}