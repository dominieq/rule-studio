package pl.put.poznan.rulestudio.model.response;

import com.fasterxml.jackson.annotation.JsonValue;
import it.unimi.dsi.fastutil.ints.IntSortedSet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.enums.ConeType;
import pl.put.poznan.rulestudio.exception.WrongParameterException;
import pl.put.poznan.rulestudio.model.DominanceCones;

public class ChosenDominanceConeResponse {

    @JsonValue
    private IntSortedSet dominanceCone;

    private ChosenDominanceConeResponse() {
        //private constructor
    }

    public IntSortedSet getDominanceCone() {
        return dominanceCone;
    }

    @Override
    public String toString() {
        return "ChosenDominanceConeResponse{" +
                "DominanceCone=" + dominanceCone +
                '}';
    }

    public static class ChosenDominanceConeResponseBuilder {
        private static final Logger logger = LoggerFactory.getLogger(ChosenDominanceConeResponseBuilder.class);

        private IntSortedSet dominanceCone;

        public static ChosenDominanceConeResponseBuilder newInstance() {
            return new ChosenDominanceConeResponseBuilder();
        }

        public ChosenDominanceConeResponseBuilder setDominanceCone(IntSortedSet dominanceCone) {
            this.dominanceCone = dominanceCone;
            return this;
        }

        public ChosenDominanceConeResponse build() {
            ChosenDominanceConeResponse chosenDominanceConeResponse = new ChosenDominanceConeResponse();

            chosenDominanceConeResponse.dominanceCone = this.dominanceCone;

            return chosenDominanceConeResponse;
        }

        public ChosenDominanceConeResponse build(DominanceCones dominanceCones, Integer objectIndex, ConeType coneType) {
            if((objectIndex < 0) || (objectIndex >= dominanceCones.getNumberOfObjects())) {
                WrongParameterException ex = new WrongParameterException(String.format("Given object's index \"%d\" is incorrect. You can choose object from %d to %d", objectIndex, 0, dominanceCones.getNumberOfObjects() - 1));
                logger.error(ex.getMessage());
                throw ex;
            }

            ChosenDominanceConeResponse chosenDominanceConeResponse = new ChosenDominanceConeResponse();
            switch (coneType) {
                case POSITIVE:
                    chosenDominanceConeResponse.dominanceCone = dominanceCones.getPositiveDCones()[objectIndex];
                    break;
                case NEGATIVE:
                    chosenDominanceConeResponse.dominanceCone = dominanceCones.getNegativeDCones()[objectIndex];
                    break;
                case POSITIVE_INVERTED:
                    chosenDominanceConeResponse.dominanceCone = dominanceCones.getPositiveInvDCones()[objectIndex];
                    break;
                case NEGATIVE_INVERTED:
                    chosenDominanceConeResponse.dominanceCone = dominanceCones.getNegativeInvDCones()[objectIndex];
                    break;
                default:
                    WrongParameterException ex = new WrongParameterException(String.format("Given type of cone \"%s\" is unrecognized.", coneType));
                    logger.error(ex.getMessage());
                    throw ex;
            }
            return chosenDominanceConeResponse;
        }
    }
}
