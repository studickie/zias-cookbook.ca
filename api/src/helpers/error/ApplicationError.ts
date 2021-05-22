/*
*   Node.js Error class: nodejs.org/api/errors.html#errors_new_error_message
*   ------------------------------------------------------------------------
*   Building out error classes: 
*       -> smashingmagazine.com/2020/08/error-handling-nodejs-error-classes
*       -> toptal.com/nodejs/node-js-error-handling
*       -> joyent.com/node-js/production/design/errors
*/

enum ErrorStatusCode {
    badRequest = 400,
    unauthorized = 401,
    notFound = 404,
    server = 500
}

export interface IApplicationError extends Error {
    isOpError: boolean;
    statusCode: ErrorStatusCode;
}

abstract class ApplicationError extends Error implements IApplicationError {
    public isOpError: boolean;
    public statusCode: ErrorStatusCode;

    constructor(
        statusCode: ErrorStatusCode = ErrorStatusCode.server,
        message = 'Oops! Something went wrong.'
    ) {
        super(message);

        this.statusCode = statusCode;
        this.isOpError = true;

        Error.captureStackTrace(this, ApplicationError);
    }

    get name(): string {
        /*
            For use on classes inheriting from ApplicationError where name should follow naming 
            pattern Error{Descriptor}.

            Ignore 'Error' and join the remaining word array, words identified by their starting 
            uppercase characters, with a space between.
            e.g.: ErrorNotFound to result in Not Found
        */
        return this.constructor.name.match(/(?!Error)([A-Z][a-z]*)/g)?.join(' ') || 'Application Error';
    }
}

export class ErrorBadRequest extends ApplicationError {

    constructor(message?: string) {
        super(ErrorStatusCode.badRequest, message = 'Bad Request');
    }
}

export class ErrorNotFound extends ApplicationError {

    constructor(message?: string) {
        super(ErrorStatusCode.notFound, message = 'Not Found');
    }
}

export class ErrorUnauthorized extends ApplicationError {

    constructor(message?: string) {
        super(ErrorStatusCode.unauthorized, message = 'Unauthorized');
    }
}