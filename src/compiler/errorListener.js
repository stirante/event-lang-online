import antlr4 from "antlr4";

export default class ErrorListener extends antlr4.error.ErrorListener {
    onError;

    constructor(onError) {
        super();
        this.onError = onError;
    }

    syntaxError(recognizer, symbol, line, column, message) {
        this.onError(message + " at line " + line)
    }
}