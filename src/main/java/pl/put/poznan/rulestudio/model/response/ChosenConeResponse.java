package pl.put.poznan.rulestudio.model.response;

import it.unimi.dsi.fastutil.ints.IntSortedSet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.put.poznan.rulestudio.enums.ConeType;
import pl.put.poznan.rulestudio.exception.WrongParameterException;
import pl.put.poznan.rulestudio.model.DominanceCones;

public class ChosenConeResponse {

    private static final Logger logger = LoggerFactory.getLogger(ChosenConeResponse.class);

    private IntSortedSet dominanceCone;

    private ChosenConeResponse() {
        //empty constructor
    }

    public IntSortedSet getDominanceCone() {
        return dominanceCone;
    }

    @Override
    public String toString() {
        return "ChosenConeResponse{" +
                "DominanceCone=" + dominanceCone +
                '}';
    }

    public static class ChosenConeResponseBuilder {
        private IntSortedSet dominanceCone;

        public static ChosenConeResponseBuilder newInstance() {
            return new ChosenConeResponseBuilder();
        }

        public ChosenConeResponseBuilder setDominanceCone(IntSortedSet dominanceCone) {
            this.dominanceCone = dominanceCone;
            return this;
        }

        public ChosenConeResponse build() {
            ChosenConeResponse chosenConeResponse = new ChosenConeResponse();

            chosenConeResponse.dominanceCone = this.dominanceCone;

            return chosenConeResponse;
        }

        public ChosenConeResponse build(DominanceCones dominanceCones, Integer objectId, ConeType coneType) {
            if((objectId < 0) || (objectId >= dominanceCones.getNumberOfObjects())) {
                WrongParameterException ex = new WrongParameterException(String.format("Given object id \"%d\" is incorrect. You can choose object from %d to %d", objectId, 0, dominanceCones.getNumberOfObjects() - 1));
                logger.error(ex.getMessage());
                throw ex;
            }

            ChosenConeResponse chosenConeResponse = new ChosenConeResponse();
            switch (coneType) {
                case POSITIVE:
                    chosenConeResponse.dominanceCone = dominanceCones.getPositiveDCones()[objectId];
                    break;
                case NEGATIVE:
                    chosenConeResponse.dominanceCone = dominanceCones.getNegativeDCones()[objectId];
                    break;
                case POSITIVE_INVERTED:
                    chosenConeResponse.dominanceCone = dominanceCones.getPositiveInvDCones()[objectId];
                    break;
                case NEGATIVE_INVERTED:
                    chosenConeResponse.dominanceCone = dominanceCones.getNegativeInvDCones()[objectId];
                    break;
                default:
                    WrongParameterException ex = new WrongParameterException(String.format("Given type of cone \"%s\" is unrecognized.", coneType));
                    logger.error(ex.getMessage());
                    throw ex;
            }
            return chosenConeResponse;
        }
    }
}
