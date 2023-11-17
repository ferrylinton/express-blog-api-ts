import { address } from 'ip';
import * as whitelistService from "../../src/services/whitelist-service";

export const initWhitelistData = async () => {
    try {
        const createdBy = 'admin111';
        const createdAt = new Date();

        await whitelistService.create({ ip: "localhost", description: "Local computer", createdBy, createdAt });
        await whitelistService.create({ ip: "127.0.0.1", description: "Local computer", createdBy, createdAt });
        await whitelistService.create({ ip: address(), description: "Local computer", createdBy, createdAt });

        await whitelistService.create({ ip: "103.147.154.179", description: "Marmeamc webhost", createdBy, createdAt });
        await whitelistService.create({ ip: "192.168.2.247", description: "Marmeamc webhost", createdBy, createdAt });
        await whitelistService.create({ ip: "2001:df7:5300:2::82", description: "Marmeamc webhost", createdBy, createdAt });
        
    } catch (error) {
        console.log(error);
    }

}
