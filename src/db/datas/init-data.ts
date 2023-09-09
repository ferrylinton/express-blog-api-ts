import { BASIC, MODIFY_USER_DATA, MODIFY_WHITELIST_DATA, READ_USER_DATA, READ_WHITELIST_DATA } from "../../configs/auth-constant";
import * as authorityService from "../../services/authority-service";
import * as userService from "../../services/user-service";
import * as whitelistService from "../../services/whitelist-service";
import { logger } from '../../configs/winston';


(async () => {
    logger.info('[MONGODB] init data');

    try {

        await whitelistService.createMany(['localhost', '127.0.0.1', '172.28.160.1', '192.168.231.31']);

        await authorityService.create(BASIC, 'Basic Authority');
        await authorityService.create(READ_WHITELIST_DATA, 'Read whitelist data');
        await authorityService.create(MODIFY_WHITELIST_DATA, 'Modify whitelist data');
        await authorityService.create(READ_USER_DATA, 'Read user data');
        await authorityService.create(MODIFY_USER_DATA, 'Modify user data');

        await userService.create('admin', 'admin', 'admin@gmail.com', [
            BASIC,
            READ_WHITELIST_DATA,
            MODIFY_WHITELIST_DATA,
            READ_USER_DATA,
            MODIFY_USER_DATA
        ]);
        await userService.create('user', 'user', 'user@email.com');


    } catch (error: any) {
        logger.error(error);
    }

    process.exit();
})()