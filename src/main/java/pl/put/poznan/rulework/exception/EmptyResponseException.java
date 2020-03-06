package pl.put.poznan.rulework.exception;

import java.util.UUID;

public class EmptyResponseException extends RuntimeException {

    public EmptyResponseException(String target, UUID id) {
        super("The value of " + target + " is empty in given Project (" + id + ")");
    }
}
