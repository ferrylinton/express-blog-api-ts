import * as auth from "../../src/configs/auth-constant";
import * as userService from "../../src/services/user-service";

const password = process.env.PASSWORD || "password";
const passwordConfirm = password;

export const initUserData = async () => {
    try {
        const createdBy = auth.SYSTEM;
        const createdAt = new Date();

        await userService.create({
            username: "system",
            password,
            passwordConfirm,
            email: "system@gmail.com",
            locked: true,
            activated: false,
            loginAttempt: 1,
            createdBy,
            createdAt,
            authorities: [auth.BASIC]
        });

        await userService.create({
            username: "admin111",
            password: "admin111",
            passwordConfirm: "admin111",
            email: "admin111@gmail.com",
            locked: false,
            activated: true,
            loginAttempt: 1,
            createdBy,
            createdAt,
            authorities: [
                auth.BASIC,

                auth.READ_WHITELIST_DATA,
                auth.MODIFY_WHITELIST_DATA,
                auth.READ_USER_DATA,
                auth.MODIFY_USER_DATA,

                auth.BLOG_OWNER,
                auth.BLOG_ADMIN,
                auth.IMAGE_OWNER,
                auth.IMAGE_ADMIN
            ]
        });

        await userService.create({
            username: "ferrylinton",
            password,
            passwordConfirm,
            email: "ferrylinton@gmail.com",
            locked: false,
            activated: true,
            loginAttempt: 1,
            createdBy,
            createdAt,
            authorities: [
                auth.BASIC,
                auth.READ_WHITELIST_DATA,
                auth.BLOG_OWNER,
                auth.IMAGE_OWNER
            ]
        });

    } catch (error) {
        console.log(error);
    }
}
