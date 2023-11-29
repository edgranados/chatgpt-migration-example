import { JSDOM, VirtualConsole } from 'jsdom';

const virtualConsole = new VirtualConsole();
virtualConsole.on("error", () => {
    // No-op to skip console errors.
});

export const getArticleObjByURL = async (url) => {
    try {
        const domData = await JSDOM.fromURL(url, { virtualConsole });
        const articleData = domData.window.document.getElementsByTagName('article')[0];

        const articleObj = {};
        articleObj.title = domData.window.document.title;
        articleObj.body = [];
        
        const h1Data = articleData.getElementsByTagName('h1')[0];
        articleObj.body.push({
            node: h1Data.nodeName,
            content: h1Data.outerHTML,
            nodes: h1Data.childNodes
        });

        const bodyData = articleData.getElementsByClassName(
            'wp-block-post-content'
        )[0].childNodes;
        for (const item of bodyData) {
            if (item.nodeName === '#text') {
                continue;
            }
            articleObj.body.push({
                node: item.nodeName,
                content: item.outerHTML,
                nodes: item.childNodes
            });
        }
        return articleObj;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};
