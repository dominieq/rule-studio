import React from "react";
import PropTypes from "prop-types";
import FilterNoResults from "./Filtering/FilterNoResults";
import CustomBox from "../../../Utils/Containers/CustomBox";
import { ResultList, ResultListSubheader } from "../../../Utils/DataDisplay/ResultList";
import StyledCircularProgress from "../../../Utils/Feedback/StyledCircularProgress";

function TabBody(props) {
    const { content, id, isArray, isLoading, ListProps, ListSubheaderProps, noFilterResults, subheaderContent } = props;

    return (
        <CustomBox id={id} variant={"TabScrollable"}>
            {isLoading &&
                <StyledCircularProgress />
            }
            {!isLoading && isArray &&
                <ResultList
                    subheader={
                        <ResultListSubheader {...ListSubheaderProps}>
                            {subheaderContent}
                        </ResultListSubheader>
                    }
                    {...ListProps}
                >
                    {content}
                </ResultList>
            }
            {noFilterResults &&
                <FilterNoResults />
            }
        </CustomBox>
    )
}

TabBody.propTypes = {
    content: PropTypes.arrayOf(PropTypes.object),
    id: PropTypes.string,
    isArray: PropTypes.bool,
    isLoading: PropTypes.bool,
    ListProps: PropTypes.shape({
        onItemSelected: PropTypes.func,
    }),
    ListSubheaderProps: PropTypes.object,
    noFilterResults: PropTypes.bool,
    subheaderContent: PropTypes.arrayOf(PropTypes.object)
};

TabBody.defaultProps = {
    isArray: false,
    isLoading: false,
    noFilterResults: false,
};

export default TabBody;