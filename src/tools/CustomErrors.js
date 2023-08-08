export default class CustomErrors {
    static createError(name = "Error", cause, message, code = 1) {
        const error = new Error();        
        error.message = message;
        error.cause = cause;
        error.name = name;
        error.code = code;
        throw error;
    }
}