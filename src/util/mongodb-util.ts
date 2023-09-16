import { MongoServerError } from "mongodb";

export const handleMongoServerError = (error: any) => {
    if (error instanceof MongoServerError) {
        const errInfo = (error as MongoServerError).errInfo;

        if (errInfo) {
            const errorValidations = errInfo['details']['schemaRulesNotSatisfied'][0]['propertiesNotSatisfied'];
            if (errorValidations instanceof Array) {
                errorValidations.map((propertiesNotSatisfied: any) => {
                    return `[${propertiesNotSatisfied.propertyName}] is not valid`;
                });
            }
        }
    }
}