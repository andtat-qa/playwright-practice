export enum ApiMessages {
    USER_EXISTS = 'User exists!',
    WEAK_PASSWORD = "Passwords must have at least one non alphanumeric character, one digit ('0'-'9'), one uppercase ('A'-'Z'), one lowercase ('a'-'z'), one special character and Password must be eight characters or longer.",
    AUTH_SUCCESS = 'User authorized successfully.',
    AUTH_FAILED = 'User authorization failed.',
    USER_NOT_AUTHORIZED = 'User not authorized!',
    ISBN_NOT_AVAILABLE = 'ISBN supplied is not available in Books Collection!',
    ISBN_ALREADY_PRESENT = "ISBN already present in the User's Collection!",
    ISBN_NOT_IN_USER_COLLECTION = "ISBN supplied is not available in User's Collection!",
    USER_NOT_FOUND = 'User not found!'
}
