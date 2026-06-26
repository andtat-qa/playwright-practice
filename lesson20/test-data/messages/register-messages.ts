// Create enum for register messages used in tests - register.spec.ts
export enum RegisterMessages {
    EMAIL_EMPTY_VALIDITY = 'valueMissing',
    FIELD_EMPTY_MESSAGE = 'Please fill out this field.',
    EMAIL_INCORRECT_MESSAGE = "Please include an '@' in the email address. 'invalidEmail' is missing an '@'.",
    PASSWORD_EMPTY_MESSAGE = 'Please fill out this field.',
}