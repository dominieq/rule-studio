package pl.put.poznan.rulework.exception;

import java.util.UUID;

public class ProjectNotFoundException extends RuntimeException {

    public ProjectNotFoundException(UUID id) {
        super("There is no project with given id: " + id);
    }

}
