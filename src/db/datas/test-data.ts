import * as userService from "../../services/user-service";
import { handleMongoServerError } from "../../util/mongodb-util";


(async () => {
    console.log('[MONGODB] test data');

    try {
        const result = await userService.findByUsername('admin');
        console.log(result);
    } catch (error: any) {
        handleMongoServerError(error);
    }

    process.exit();
})()