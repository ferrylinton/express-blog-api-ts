import i18n from 'i18n';
import path from 'path';
import { Express } from 'express';

i18n.configure({
    locales: ['id', 'en'],
    defaultLocale: 'en',
    directory: path.join(process.cwd(), 'src', 'locales'),
    header: 'x-accept-language', 
});

export default function setLocales(app: Express) {
    app.use(i18n.init);
}
