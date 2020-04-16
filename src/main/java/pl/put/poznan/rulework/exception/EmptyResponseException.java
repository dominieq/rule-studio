package pl.put.poznan.rulework.exception;

public class EmptyResponseException extends RuntimeException {

    public EmptyResponseException(String message) {
        super(message);
    }
}
