import express, { Express } from 'express';
import favicon from 'express-favicon';
import helmet from 'helmet';
import setLocales from './configs/i18n';
import { authHandler } from './middleware/auth-handler';
import { clientInfoHandler } from './middleware/client-info-handler';
import { corsHandler } from './middleware/cors-handler';
import { notFoundHandler } from './middleware/not-found-handler';
import { rateLimitHandler } from './middleware/rate-limit-handler';
import { restErrorHandler } from './middleware/rest-error-handler';
import setRoutes from './routers';


const app: Express = express();

app.set('trust proxy', 1);
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(clientInfoHandler);
app.use(rateLimitHandler);
app.use(corsHandler);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(authHandler);

setLocales(app);
// Routes
setRoutes(app);

app.use(notFoundHandler);
app.use(restErrorHandler);

export default app;