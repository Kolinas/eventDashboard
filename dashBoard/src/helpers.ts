export const toCamelCase = <T extends Record<string, any>>(obj: T) => {
    const result: Record<string, any> = {};

    Object.keys(obj).forEach((key) => {
        if (key.includes('_')) {
            const camelCaseKey = key.replace(/_([a-z])/g, (match) => match[1].toUpperCase());
            result[camelCaseKey] = obj[key];
        } else {
            result[key] = obj[key];
        }
    });

    return result;
};


export const toSnakeCase = <T extends Record<string, any>>(obj: T) => {
    const result: Record<string, any> = {};

    for (const key in obj) {
        const snakeCaseKey = key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
        result[snakeCaseKey] = obj[key];
    }

    return result;
};


export const cleanTags = (tagsString: any) => {
    const tags = tagsString.split(',');
    const cleanedTags = tags.map(tag => tag.replace(/\s+/g, ''));
    const cleanedTagsString = cleanedTags.join(', ');
    return cleanedTagsString;
}