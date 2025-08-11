// Predicted errors
export class ExpectedError extends Error {}

// Unexpected errors
export class UnexpectedError extends Error {}
export class DatabaseError extends UnexpectedError {}
export class MailerError extends UnexpectedError {}