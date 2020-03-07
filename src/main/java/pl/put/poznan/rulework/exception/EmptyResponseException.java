package pl.put.poznan.rulework.exception;

import java.util.UUID;

public class EmptyResponseException extends RuntimeException {

    public EmptyResponseException(String target, UUID id) {
        super("An object containing " + target + " is empty in given Project (" + id + ")");
    }
}
