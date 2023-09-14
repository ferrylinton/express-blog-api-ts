import * as auth from "../../configs/auth-constant";
import * as authorityService from "../../services/authority-service";


export const initAuthorityData = async () => {
    try {
        const createdBy = auth.SYSTEM;
        const createdAt = new Date();

        await authorityService.create({ code: auth.BASIC, description: "Basic Authority", createdBy, createdAt });

        await authorityService.create({ code: auth.READ_WHITELIST_DATA, description: "Read whitelist data", createdBy, createdAt });
        await authorityService.create({ code: auth.MODIFY_WHITELIST_DATA, description: "Modify whitelist data", createdBy, createdAt });
        await authorityService.create({ code: auth.READ_USER_DATA, description: "Read user data", createdBy, createdAt });
        await authorityService.create({ code: auth.MODIFY_USER_DATA, description: "Modify user data", createdBy, createdAt });

        await authorityService.create({ code: auth.BLOG_OWNER, description: "Modify user's posts and tags", createdBy, createdAt });
        await authorityService.create({ code: auth.BLOG_ADMIN, description: "Modify all posts and tags", createdBy, createdAt });
        await authorityService.create({ code: auth.IMAGE_OWNER, description: "Modify user's images", createdBy, createdAt });
        await authorityService.create({ code: auth.IMAGE_ADMIN, description: "Modify all images", createdBy, createdAt });
    } catch (error) {
        console.log(error);
    }
}
