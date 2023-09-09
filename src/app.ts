import express, { Express } from 'express';
import favicon from 'express-favicon';
import helmet from 'helmet';
import { authHandler } from './middleware/auth-handler';
import { corsHandler } from './middleware/cors-handler';
import { ipWhitelistHandler } from './middleware/ip-whitelist-handler';
import { notFoundHandler } from './middleware/not-found-handler';
import { restErrorHandler } from './middleware/rest-error-handler';
import setRoutes from './routers';
import { clientInfoHandler } from './middleware/client-info-handler';


const app: Express = express();

app.use(favicon(__dirname + '/public/favicon.png'));
app.use(ipWhitelistHandler);
app.use(clientInfoHandler);
app.use(corsHandler);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(authHandler);

// Routes
setRoutes(app);

app.use(notFoundHandler);
app.use(restErrorHandler);

export default app;