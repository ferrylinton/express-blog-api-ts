import parser from 'ua-parser-js';


export const getBrowserAndOs = (uaString: string | undefined) => {
    const { browser, os } = parser(uaString);
    
    return {
        browser: browser?.name,
        os: os?.name
    }
}