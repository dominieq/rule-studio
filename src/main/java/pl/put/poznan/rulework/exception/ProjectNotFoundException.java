package pl.put.poznan.rulework.exception;

public class ProjectNotFoundException extends RuntimeException {

    public ProjectNotFoundException() {
        super("Something went wrong. Couldn't find project :(");
    }

}
