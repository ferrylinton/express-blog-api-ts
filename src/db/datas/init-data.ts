import { BASIC, BLOG_ADMIN, BLOG_OWNER, IMAGE_ADMIN, IMAGE_OWNER, MODIFY_USER_DATA, MODIFY_WHITELIST_DATA, READ_USER_DATA, READ_WHITELIST_DATA } from "../../configs/auth-constant";
import { logger } from '../../configs/winston';
import * as authorityService from "../../services/authority-service";
import * as userService from "../../services/user-service";
import * as whitelistService from "../../services/whitelist-service";
import { Create } from "../../types/common-type";


(async () => {
    logger.info('[MONGODB] init data');

    try {
        const createdBy = 'system';
        const createdAt = new Date();

        // await whitelistService.createMany(['localhost', '127.0.0.1', '172.28.160.1', '192.168.231.31']);

        // await authorityService.create({ code: BASIC, description: "Basic Authority", createdBy, createdAt });

        // await authorityService.create({ code: READ_WHITELIST_DATA, description: "Read whitelist data", createdBy, createdAt });
        // await authorityService.create({ code: MODIFY_WHITELIST_DATA, description: "Modify whitelist data", createdBy, createdAt });
        // await authorityService.create({ code: READ_USER_DATA, description: "Read user data", createdBy, createdAt });
        // await authorityService.create({ code: MODIFY_USER_DATA, description: "Modify user data", createdBy, createdAt });

        // await authorityService.create({ code: BLOG_OWNER, description: "Modify user's posts and tags", createdBy, createdAt });
        // await authorityService.create({ code: BLOG_ADMIN, description: "Modify all posts and tags", createdBy, createdAt });
        // await authorityService.create({ code: IMAGE_OWNER, description: "Modify user's images", createdBy, createdAt });
        // await authorityService.create({ code: IMAGE_ADMIN, description: "Modify all images", createdBy, createdAt });

        const admin111: Create<User> = {
            username: "admin111",
            password: "admin111",
            email: "admin111@gmail.com",
            locked: false,
            activated: true,
            loginAttempt: 1,
            createdBy, 
            createdAt,
            authorities: [
                BASIC,

                READ_WHITELIST_DATA,
                MODIFY_WHITELIST_DATA,
                READ_USER_DATA,
                MODIFY_USER_DATA,

                BLOG_OWNER,
                BLOG_ADMIN,
                IMAGE_OWNER,
                IMAGE_ADMIN
            ]
        }
        await userService.create(admin111);

    } catch (error: any) {
        console.error(error);
        logger.error(error);
    }

    process.exit();
})()