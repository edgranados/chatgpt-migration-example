import contentfulManagement from 'contentful-management';
import { getChatGPTRecommendation } from "./chatgptService.js";

let manager = null;

const getManager = () => {
    const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

    if (manager != null) {
        return manager;
    }

    manager = contentfulManagement.createClient({
        accessToken: MANAGEMENT_TOKEN
    });

    return manager;
};

export const getArticleById = async (articleId) => {
    const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
    const ENVIRONMENT_ID = process.env.CONTENTFUL_ENVIRONMENT_ID;
  
    const contentfulManager = getManager();
    const space = await contentfulManager.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
  
    const article = await environment.getEntry(articleId);
    return article;
  };

export const createEntry = async (type, dataObj) => {
    const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
    const ENVIRONMENT_ID = process.env.CONTENTFUL_ENVIRONMENT_ID;
  
    const contentfulManager = getManager();
    const space = await contentfulManager.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    let entry = await environment.createEntry(type, dataObj);
    entry = await entry.publish();
    return entry;
  };

const formatHContent = (obj) => {
    return `<${obj.node.toLowerCase()}>${obj.nodes[0].textContent}</${obj.node.toLowerCase()}>`
};

const checkContent = (obj) => {
    if (obj.nodeType === 'text' && !('data' in obj)) {
        obj.data = {};
    }
    if (obj.nodeType === 'text' && !('marks' in obj)) {
        obj.marks = [];
    }
    if (obj.nodeType === 'hyperlink' && ('data' in obj)) {
        delete obj.data.target;
        delete obj.data.rel;
    }
    if (obj.nodeType === 'code') {
        obj.nodeType = 'text';
        obj.marks = [ { type: 'code' } ];
        obj.value = obj.content[0]?.content[0]?.value || '';
        delete obj.content;
    }
    if (obj.nodeType === 'list-item') {
        if (obj.content[0].nodeType !== 'paragraph') {
            obj.content = [{
                nodeType: 'paragraph',
                data: {},
                content: obj.content
            }]
        }
    }
    if ('content' in obj && obj.content.length > 0) {
        for (const item of obj.content) {
            checkContent(item);
        }
    }
    return obj;
};

const sanitizeObject = (obj) => {
    if (!('data' in obj[0])) {
        obj[0].data = {};
    }
    for(const item of obj[0].content) {
        if ('content' in item && item.content.length === 0) {
            delete item.content;
        }
        if ('content' in item && item.content.length > 0) {
            checkContent(item.content[0]);
        }
        checkContent(item);
    }
    return obj;
};

export const convertItemByTag = async (obj) => {
    let result = null;
    let chatGPTRecommendation = null;
    switch (obj.node) {
        case 'FIGURE':
            //TODO
            break;
        case 'H1':
        case 'H2':
        case 'H4':
            const textHForOpenAI = formatHContent(obj);
            chatGPTRecommendation = await getChatGPTRecommendation(textHForOpenAI);
            result = sanitizeObject(chatGPTRecommendation.content);
            break;
        case 'P':
        case 'UL':
            chatGPTRecommendation = await getChatGPTRecommendation(obj.content);
            result = sanitizeObject(chatGPTRecommendation.content);
            break;
        default:
            console.warn(`TAG NOT IMPLEMENTED: ${obj.node}`);
            break;
    }
    return result;
}