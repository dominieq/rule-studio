package pl.put.poznan.rulestudio.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@ControllerAdvice
public class CustomResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ProjectNotFoundException.class)
    public void projectNotFoundException(
            ProjectNotFoundException ex,
            HttpServletResponse response) throws IOException {
        response.sendError(HttpStatus.NOT_ACCEPTABLE.value(), ex.getMessage());
    }

    @ExceptionHandler({EmptyResponseException.class, NoRulesException.class, NoDataException.class})
    public void emptyResponseException(
            RuntimeException ex,
            HttpServletResponse response) throws IOException {
        response.sendError(HttpStatus.NOT_FOUND.value(), ex.getMessage());
    }

    @ExceptionHandler(WrongParameterException.class)
    public void wrongParameterException(
            WrongParameterException ex,
            HttpServletResponse response) throws IOException {
        response.sendError(HttpStatus.UNPROCESSABLE_ENTITY.value(), ex.getMessage());
    }

    @ExceptionHandler(NotSuitableForInductionOfPossibleRulesException.class)
    public void notSuitableForInductionOfPossibleRulesException(
            NotSuitableForInductionOfPossibleRulesException ex,
            HttpServletResponse response) throws IOException {
        response.sendError(460, ex.getMessage());
    }

    @ExceptionHandler(NoHashInRuleSetException.class)
    public void noHashInRuleSetException(
            NoHashInRuleSetException ex,
            HttpServletResponse response) throws IOException {
        response.sendError(461, ex.getMessage());
    }

    @ExceptionHandler(IncompatibleLearningInformationTableException.class)
    public void incompatibleLearningInformationTableException(
            IncompatibleLearningInformationTableException ex,
            HttpServletResponse response) throws IOException {
        response.sendError(462, ex.getMessage());
    }
}
