import { MongoServerError } from "mongodb";

export const handleMongoServerError = (error: any) => {
    console.error(error);

    if (error instanceof MongoServerError) {
        const errInfo = (error as MongoServerError).errInfo;

        if (errInfo) {
            const errorValidations = errInfo['details']['schemaRulesNotSatisfied'][0]['propertiesNotSatisfied'];
            if (errorValidations instanceof Array) {
                const errors = errorValidations.map((propertiesNotSatisfied: any) => {
                    return `[${propertiesNotSatisfied.propertyName}] is not valid`;
                });

                console.log(errors);
            }
        }
    }
}