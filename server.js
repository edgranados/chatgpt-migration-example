import dotenv from 'dotenv';
import { getArticleObjByURL } from './services/htmlService.js';
import { convertItemByTag, createEntry } from './services/contentfulService.js';

const ARTICLE = 'https://wordpress.org/documentation/article/get-started-with-wordpress/';

dotenv.config();

const main = async () => {
    const articleData = await getArticleObjByURL(ARTICLE);
    let content = [];

    for (const item of articleData.body) {
        const convertedData = await convertItemByTag(item);
        if (convertedData === null) {
            continue;
        }
        content = [...content, ...convertedData];
    }

    const entryBody = {
        metadata: { tags: [] },
        fields: {
            title: { 'en-US': articleData.title },
            body: {
                'en-US': {
                    nodeType: 'document',
                    data: {},
                    content: content
                }
            }
        }
    };
    const entry = await createEntry('blogPage', entryBody);
    console.log(entry);
}

main();