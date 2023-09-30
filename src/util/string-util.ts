export function createSlug(str: string){
    return str.replace(/\s+/g, '').replace(/\.[^.]*$/,'').toLowerCase();
}

export function hasNoSpace(str: string){
    const regexp = /^\S*$/;
    return regexp.test(str)
}