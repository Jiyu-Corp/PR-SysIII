// Predicted errors
export class ExpectedError extends Error {}
export class UniqueFieldError extends ExpectedError {
    public readonly ukConstraint: string;
    constructor(ukConstraint: string) {
        super();
        this.ukConstraint = ukConstraint;
    }
}

// Unexpected errors
export class UnexpectedError extends Error {}
export class DatabaseError extends UnexpectedError {}
export class MailerError extends UnexpectedError {}