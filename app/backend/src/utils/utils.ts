import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { ExpectedError, UniqueFieldError } from "./app.errors";
import { QueryFailedError } from 'typeorm';

function promiseCatchError<T>(promise: Promise<T>): Promise<[undefined, T] | [Error]> {
    return promise
        .then(data => 
            [undefined, data] as [undefined, T]
        )
        .catch(error =>
            [error]
        );
}


function promiseCatchErrorHTTPDefault<T>(promise: Promise<T>): Promise<[undefined, T] | [BadRequestException | InternalServerErrorException]> {
    return promise
        .then(data => 
            [undefined, data] as [undefined, T]
        )
        .catch(error => {
            if(error instanceof ExpectedError) {
                return [new BadRequestException(error.message)];
            }
            
            return [new InternalServerErrorException()];
        });
}

function checkAndGetUKError(error: QueryFailedError): UniqueFieldError | undefined {
    const isUKError = error.message.includes('violates unique constraint');
    if(!isUKError) return;

    const match = error.message.match(/unique constraint "(.*?)"/);
    const ukConstraint = match![1];
    const uniqueFieldError = new UniqueFieldError(ukConstraint);

    return uniqueFieldError;
}

export {
    promiseCatchError,
    promiseCatchErrorHTTPDefault,

    checkAndGetUKError
}