import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { ExpectedError } from "./app.errors";

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

export {
    promiseCatchError,
    promiseCatchErrorHTTPDefault
}