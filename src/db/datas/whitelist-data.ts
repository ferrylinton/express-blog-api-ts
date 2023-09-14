import { address } from 'ip';
import * as whitelistService from "../../services/whitelist-service";

export const initWhitelistData = async () => {
    try {
        const createdBy = 'system';
        const createdAt = new Date();

        await whitelistService.create({ ip: "localhost", description: "Local computer", createdBy, createdAt });
        await whitelistService.create({ ip: "127.0.0.1", description: "Local computer", createdBy, createdAt });
        await whitelistService.create({ ip: address(), description: "Local computer", createdBy, createdAt });
    } catch (error) {
        console.log(error);
    }

}
