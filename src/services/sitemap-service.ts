import { POST_COLLECTION } from "../configs/db-constant";
import { getCollection } from "../configs/mongodb";
import { WithAudit } from "../types/common-type";
import { Post } from "../types/post-type";
import { Url } from "../types/sitemap-type";

const domain = "https://www.marmeam.com";

const lastmod = new Date('2024-01-02T03:14:53.956Z');

export const find = async (): Promise<Url[]> => {
    const urls: Url[] = [
        {
            loc: `${domain}`,
            lastmod
        },
        {
            loc: `${domain}/en`,
            lastmod
        },
        {
            loc: `${domain}/post`,
            lastmod
        },
        {
            loc: `${domain}/en/post`,
            lastmod
        }
    ];

    const postCollection = await getCollection<WithAudit<Post>>(POST_COLLECTION);
    const cursor = postCollection.find();

    for await (const doc of cursor) {
        urls.push({
            loc: `${domain}/post/${doc.slug}`,
            lastmod: doc.updatedAt ? doc.updatedAt : doc.createdAt
        })

        urls.push({
            loc: `${domain}/en/post/${doc.slug}`,
            lastmod: doc.updatedAt ? doc.updatedAt : doc.createdAt
        })
    }

    return urls;
}