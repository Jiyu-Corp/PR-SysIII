// Predicted errors
export class ExpectedError extends Error {}
export class RedundancyInUniqueError extends ExpectedError {
    public readonly ukConstraint: string;
    constructor(ukConstraint: string, errorMessage = "") {
        super(errorMessage);
        this.ukConstraint = ukConstraint;
    }
}

// Unexpected errors
export class UnexpectedError extends Error {}
export class DatabaseError extends UnexpectedError {}
export class MailerError extends UnexpectedError {}