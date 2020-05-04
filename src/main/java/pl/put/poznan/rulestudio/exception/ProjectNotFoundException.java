package pl.put.poznan.rulestudio.exception;

public class ProjectNotFoundException extends RuntimeException {

    public ProjectNotFoundException() {
        super("Something went wrong. Couldn't find project :(");
    }

}
