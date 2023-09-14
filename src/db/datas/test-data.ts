import { initTagData } from "./tag-data";

(async () => {
    console.log('[MONGODB] test data');

    try {

        await initTagData();

    } catch (error: any) {
        console.log(error);
    }finally{
        setTimeout(function () {
            process.exit();
        }, 2000);
    }

})()