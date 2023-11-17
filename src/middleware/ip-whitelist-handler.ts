import AccessControl from 'express-ip-access-control';
import { logger } from "../configs/winston";

export const denys: string[] = [];

export const allows: string[] = [];

const options: AccessControl.AclOptions = {
	mode: 'allow',
	denys,
	allows,
	forceConnectionAddress: false,
	log: function(clientIp, access) {
		logger.info(clientIp + (access ? ' accessed.' : ' denied.'));
	},
	statusCode: "401",
	redirectTo: '',
	message: 'Unauthorized'
};

export const ipWhitelistHandler = AccessControl(options);
